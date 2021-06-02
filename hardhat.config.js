/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        blockNumber: 12480976,
      },
    },
    live: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    matic: {
      url: "https://rpc-matic.maticvigil.com",
      accounts: [process.env.MAINNET_PRIVKEY]
    },
    maticTest: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.MAINNET_PRIVKEY]
    },
    binance: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: process.env.MAINNET_PRIV_PHRASE}
    },
    binanceTest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: process.env.MAINNET_PRIV_PHRASE}
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        }
      }
    ]
  },
  mocha: {
    timeout: 240000,
  },
  gasReporter: {
    // use the environmental variable REPORT_GAS to enable the hardhat gasReporter on the tests
    enabled: (process.env.REPORT_GAS === "true") ? true : false,
    currency: 'USD',
    gasPrice: 172
  }
};
