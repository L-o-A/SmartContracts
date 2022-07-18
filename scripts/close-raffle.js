const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0xD9257Db73A958D6e8881cF2C60768364482A191d";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);


    const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime() / 1000 - 86400 + "");
    const now = parseInt(new Date().getTime() / 1000);

    // await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", now + "");


    console.log("raffle closed")
    await raffle.pickWinner(100);
    // await raffle.pickWinner(100);
    // await raffle.pickWinner(100);

    // await raffle.terminate();
    console.log(2);
}

main();