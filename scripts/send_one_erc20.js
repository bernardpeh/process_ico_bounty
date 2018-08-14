// CONFIGURE YOUR ERC20 CONTRACT ADDRESS
var contract_address = '0xed340df3c339ab60418bfb7a4557f18cfc2118dd'
// CONFIGURE YOUR GAS PRICE IN WEI
var gasPrice = 2.3 * Math.pow(10,9)
// CONFIGURE TOKEN DECIMALS. CHANGE THIS DEPENDING ON TOKEN DECIMALS
var token_decimals = Math.pow(10,18)
var value = 0;
var from_address = '0xae411d79082a93812b4f246aa7ecf9a8dd6ea940'
var to_address = '0xf5a7c8b332be5c594def279427777db27eb84387'
var token_value = 21
// update nonce. remember blockchain nonce is n+1. check etherscan for latest nonce
var nonce = 35

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


async function sendToOne() {

    let contract = web3.eth.contract(token_abi).at(contract_address);

    let data = contract.transfer.getData(to_address, token_value * token_decimals)
    
    console.log('from address: ' + from_address)
    console.log('to address: ' + to_address)
    console.log('gasPrice: ' + gasPrice)
    console.log('value: ' + value)
    console.log('data: '+data)
    console.log('nonce: '+nonce)

    await web3.eth.sendTransaction({from: from_address, to: contract_address, gasPrice: gasPrice, data: data, nonce: nonce},
        (err,res) => {
        if (err) {
            console.log('err is '+err)
        }
        else {
            tx_id = res
            console.log('tx id is '+res)
        }
}   )

}

module.exports = sendToOne