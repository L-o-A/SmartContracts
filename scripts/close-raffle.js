const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0xC84aB922A574A0aFd0e9528FF1bB1F7322a3A751";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.attach("0x59cf060cF826fBF12A34eb58bD00F9F959f72828");

    const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime() / 1000 - 86400 + "");
    const now = parseInt(new Date().getTime() / 1000);

    await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", now + "");

    // await raffleHelper.putRafflePrices([500,1000, 1500, 2500],
    //     ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"], 
    //     [100, 200, 300, 400, 500], [500,1000, 1500, 2500]);

    console.log("raffle closed")
    await raffle.pickWinner(100);
    await raffle.pickWinner(100);
    await raffle.pickWinner(100);

    // await raffle.terminate();
    console.log(2);
}

main();