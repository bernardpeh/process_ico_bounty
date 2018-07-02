var con = require('./db.js');

// CONFIGURE YOUR ERC20 CONTRACT ADDRESS
var contract_address = '0xe4a6202402914291cdc0e54c13d1e93bb03883b5'
// CONFIGURE YOUR GAS PRICE IN WEI
var gasPrice = 1.1 * Math.pow(10,9)

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
/*
async function checkMined(tx_id) {
  // lets query the db. if its not included in a block, ie not yet mined we loop again
  await web3.eth.getTransaction(tx_id, async (err,res) => {
    await sleep(10000)
    console.log('blockNumber is '+res.blockNumber)
    if (res.blockNumber == '') {
      await sleep(100)
      console.log('polling...')
      await checkMined(tx_id)
    }
  })
}
*/
async function sendTransaction(to_address, token_value) {

  let from_address, nonce, tx_id = ''

  let contract = web3.eth.contract(token_abi).at(contract_address);
  web3.eth.getCoinbase( (err,res) => { from_address = res })
  await sleep(1000)
  web3.eth.getTransactionCount( from_address, (err,res) => { nonce = res })
  await sleep(1000)
  let data = contract.transfer.getData(to_address, token_value)
  await sleep(1000)
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
  await sleep(5000)
  // await checkMined(tx_id)
  // onced mined, lets insert into db
  await con.query("update bounty set tx_id='"+tx_id+"' where to_address='"+to_address+"'", async function (error, res, fields) {
    if (error) throw error
    console.log(tx_id+' inserted successful')
  })
}

function startLoop() {

  con.query("select * from bounty where tx_id=''", async function (error, rows, fields) {

    if (error) throw error

    for (let i = 0; i < rows.length; i++) {
      let to_address = rows[i].to_address
      let token_value = rows[i].token_value

      await sendTransaction(to_address,token_value)
    }
  });

  // con.end();
  // process.exit();

}
module.exports = startLoop
