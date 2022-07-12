const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    const RAFFLE_ADDRESS = "0x86a47f7FF6D28Bc1F8aa16b823D1C2FB855DB174";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    await raffle.pickWinner(100);
}

main();