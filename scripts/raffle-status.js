const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Checking Raffle Status...");

    const RAFFLE_ADDRESS = "0xE2dF354cF0D4524366BDc5240d79E9FA8C96A452";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    console.log("raffle status : ", await raffle._raffle_status())
}

main();