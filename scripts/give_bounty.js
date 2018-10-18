var con = require('./db.js');

// CONFIGURE YOUR ERC20 CONTRACT ADDRESS
// var contract_address = '0xf1f64f6b8e17dd68c1db10b0eed3d2541a6c09ab'
var contract_address = '0xed340df3c339ab60418bfb7a4557f18cfc2118dd'
// CONFIGURE YOUR GAS PRICE IN WEI
var gasPrice = 2 * Math.pow(10,9)
// CONFIGURE TOKEN DECIMALS. CHANGE THIS DEPENDING ON TOKEN DECIMALS
var token_decimals = Math.pow(10,18)
// CONFIGURE FROM ADDRESS
var from_address
web3.eth.getCoinbase( (err,res) => { from_address = res })
// CONFIGURE NONCE
var current_nonce = 36

var token_abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

async function checkNonce() {
  let nonce = ''
  // lets query the db. if its not included in a block, ie not yet mined we loop again
  web3.eth.getTransactionCount( from_address, (err,res) => {
    if (err) {
      console.log('err is '+err)
    }
    else {
      nonce = res
    }
  })
  await sleep(3000)

  console.log('from address is '+from_address+' and current_nonce is '+current_nonce+' and blockchain nonce is '+nonce)

  if (nonce == current_nonce) {
    current_nonce += 1
    return nonce
  }
  else {
    console.log('lets continue to wait 10 sec for tx to be propagated...')
    await sleep(10000)
    await checkNonce(from_address)
  }
}

async function sendTransaction(id, to_address, token_value) {

  let nonce, tx_id = ''

  let contract = web3.eth.contract(token_abi).at(contract_address);
  await sleep(4000)

  // if current nonce is not bigger than nonce, we wait
  await checkNonce()
  nonce = current_nonce - 1;

  let data = contract.transfer.getData(to_address, token_value * token_decimals)
  await sleep(3000)
  console.log('from address is '+from_address)
  console.log('contract address is '+contract_address)
  console.log('token value is '+token_value)
  console.log('gas price is '+gasPrice)
  console.log('nonce is '+nonce)
  console.log('data is '+data)

  // write to chain
  await web3.eth.sendTransaction({from: from_address, to: contract_address, gasPrice: gasPrice, data: data, nonce: nonce},
    (err,res) => {
    if (err) {
      console.log('err is '+err)
    }
    else {
      tx_id = res
      console.log('tx id is '+res)
    }
  })
  // this is the crucial part. Waiting for the insertion
  await sleep(22000)
  // await checkMined(tx_id)
  // onced mined, lets insert into db
  await con.query("update bounty set tx_id='"+tx_id+"' where id='"+id+"'", async function (error, res, fields) {
    if (error) throw error
    console.log(tx_id+' db insert successful')
  })
}

function startLoop() {

  con.query("select * from bounty where tx_id=''", async function (error, rows, fields) {

    if (error) throw error

    for (let i = 0; i < rows.length; i++) {
      let to_address = rows[i].to_address
      let token_value = rows[i].token_value
      let id  = rows[i].id

      await sendTransaction(id,to_address,token_value)
    }
  });

  // con.end();
  // process.exit();

}
module.exports = startLoop
