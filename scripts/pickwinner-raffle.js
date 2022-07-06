const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    const RAFFLE_ADDRESS = "0x381D8A86107bd6305EA40312f6eD0ABbea312330";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    await raffle.pickWinner(100);
}

main();