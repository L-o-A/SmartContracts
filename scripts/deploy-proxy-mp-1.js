const { ethers, upgrades } = require("hardhat");

async function main() {
    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(MultiSigAdmin, [], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("MultiSigAdmin Proxy deployed to:", box.address);
}

main();