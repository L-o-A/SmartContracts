const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    const RAFFLE_ADDRESS = "0xe5f0696c40Ff4A5C5ad42F69d79b27015dec6fC8";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    await raffle.pickWinner(5);
}

main();