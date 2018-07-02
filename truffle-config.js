require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "your secret mnemonic";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4700000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/your_id")
      },
      network_id: "3",
      gas: 4700000,
      gasPrice: 200000000000
    },
    main: {
      host: "localhost",
      port: 8545,
      network_id: "1",
      gasPrice: 20000000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
