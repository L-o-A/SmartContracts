const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Checking Raffle Status...");

    const RAFFLE_ADDRESS = "0xabd9Cc9FF49000C051079D379101a24C4f90e729";
    const USER = "0x8bc1686fe03e7cf594dcc6707f90b3a0ffdaeb83";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    console.log(1);
    // console.log("raffle status : ", await raffle._raffle_status())
    console.log("_raffle_tickets_count : ", await raffle._raffle_tickets_count(USER))
    console.log(2);
    const _raffle_winning_tickets_count = await raffle._raffle_winning_tickets_count(USER);
    console.log("_raffle_winning_tickets_count : ", _raffle_winning_tickets_count)
    for (let index = 0; index < 135; index++) {
        const ticket = await raffle._user_winning_tickets(USER, index);
        console.log("_user_winning_tickets : " + index + " -" + ticket, await raffle.balanceOf(USER, ticket))
    }
}

main();