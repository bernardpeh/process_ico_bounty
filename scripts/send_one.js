// This script just sends ETH to an individual

// CONFIGURE to_address
var to_address = 'destination_address'

// CONFIGURE YOUR GAS PRICE IN WEI
var gasPrice = 1 * Math.pow(10,9)

// CONFIGURE ETH  TO SEND IN WEI
var value = (eth_in_wei * Math.pow(10,18)) - (21000 * gasPrice)

// update nonce. remember blockchain nonce is n+1. check etherscan for latest nonce
var nonce = 2803

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

// write to chain
async function sendToOne() {

  let from_address = ''

  web3.eth.getCoinbase( (err,res) => { from_address = res })
  await sleep(3000)
  console.log('from address: ' + from_address)
  console.log('to address: ' + to_address)
  console.log('gasPrice: ' + gasPrice)
  console.log('value: ' + value)
  console.log('nonce: '+nonce)

  await web3.eth.sendTransaction({from: from_address, to: to_address, gasPrice: gasPrice, value: value, nonce: nonce},
    (err,res) => {
    if (err) {
      console.log('err is '+err)
    }
    else {
      tx_id = res
      console.log('tx id is '+res)
    }
  })

}
module.exports = sendToOne