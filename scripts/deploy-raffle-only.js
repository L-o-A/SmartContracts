const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Raffle...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    console.log(90);
    const multiSigAdmin = await MultiSigAdmin.attach("0x66A86D15849f39E461Ae4B23e9CF1aa8ED66D1Fc");
    console.log(91);

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    await raffleHelper.deployed();
    console.log("raffleHelper.address :", raffleHelper.address);


    await raffleHelper.putRafflePrices([500, 1000, 1500, 2500],
        ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"],
        [100, 200, 300, 400, 500], [500, 1000, 1500, 2500]);

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa, raffleHelper.address, multiSigAdmin.address);
    await raffle.deployed();
    console.log("raffle.address :", raffle.address);
    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach("0xe5f0696c40Ff4A5C5ad42F69d79b27015dec6fC8");
    // console.log("raffle.address :", raffle.address);


    await raffleHelper.setRaffle(raffle.address);
    // console.log(1);

    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 +  86400  + "");
    const tomorrow = parseInt(new Date().getTime()/1000 +  2* 86400  + "");
    
    await raffle.setRaffleInfo(1, "1658750400", "1658836800", "1659182400");
    console.log(2);
    
    multiSigAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(3);
}

main();