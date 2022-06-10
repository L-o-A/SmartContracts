require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

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
        // url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ROPSTEN_ALCHEMY_KEY}`
        url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_MUMBAI_KEY}`
      },
      allowUnlimitedContractSize:true
    },
  }
  // networks: {
  //   hardhat:{
  //     forking: {
  //       url: "https://eth-ropsten.alchemyapi.io/v2/2a7LlBSMIgf9YSaKtVcBWmyy5xHCNzr0"
  //     },
  //     allowUnlimitedContractSize:true
  //   },
  // }
};
