const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("winning tickets...");

    const RAFFLE_ADDRESS = "0x784Be3f7c22E440248E5973A8d1A421B9BB1ce2a";
    const USER_ADDRESS = " 0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    console.log(1);
    console.log(await raffle._raffle_winning_tickets_count(USER_ADDRESS));

}
main();