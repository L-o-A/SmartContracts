const { ethers, upgrades } = require("hardhat");

async function main() {
    const LOAAdmin = await ethers.getContractFactory("LOAAdmin");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(LOAAdmin, [], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("LOAAdmin Proxy deployed to:", box.address);
}

main();