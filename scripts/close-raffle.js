const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0xAF3AA341055bD6FD449de97BB88Fa1C4bAB3fa56";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);


    const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime() / 1000 - 86400 + "");
    const now = parseInt(new Date().getTime() / 1000);

    await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", now + "");


    console.log("raffle closed")
    // await raffle.pickWinner(100);
    // await raffle.pickWinner(100);
    // await raffle.pickWinner(100);

    // await raffle.terminate();
    console.log(2);
}

main();