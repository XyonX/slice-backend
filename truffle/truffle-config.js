require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    holesky: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          "https://ethereum-holesky.publicnode.com"
        ),
      network_id: 17000,
      gas: 8000000,
      gasPrice: 1000000000,
      timeoutBlocks: 200,
      networkCheckTimeout: 60000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
