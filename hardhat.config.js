require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

let secret = require("./secret.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat:{
      forking: {
        // url: secret.ROPSTEN_ALCHEMY_URL
        url: secret.POLYGON_MUMBAI_URL
      },
      allowUnlimitedContractSize:true
    },
    bscmainnet: {
      url: secret.BSC_CHAINLINK_URL,
      accounts: [secret.WALLET_LIVE_PRI_KEY],
    },
    bsctestnet: {
      url: secret.BSC_TESTNET_CHAINLINK_URL,
      accounts: [secret.WALLET_PRI_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    },
    ropsten: {
      url: secret.ROPSTEN_ALCHEMY_URL,
      accounts: [secret.WALLET_PRI_KEY],
    },
    mumbai: {
      url: secret.POLYGON_MUMBAI_URL,
      accounts: [secret.WALLET_PRI_KEY],
      // gas: 2100000,
      // gasPrice: 8000000000
    },
  },

  etherscan: {
    apiKey: secret.BSC_API_KEY,
  },

  // networks: {
  //   mumbai: {
  //     url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_MUMBAI_KEY}`,
  //     accounts: [process.env.WALLET_PRI_KEY],
  //   },
  // },
  // etherscan: {
  //   apiKey: process.env.MUMBAI_SCAN_API_KEY,
  // },
};
