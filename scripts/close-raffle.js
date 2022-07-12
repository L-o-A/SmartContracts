const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0x86a47f7FF6D28Bc1F8aa16b823D1C2FB855DB174";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime() / 1000 - 86400 + "");
    const now = parseInt(new Date().getTime() / 1000);

    await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", now + "");

    console.log("raffle closed")
    // await raffle.pickWinner(10);

    // await raffle.terminate();
    console.log(2);
}

main();