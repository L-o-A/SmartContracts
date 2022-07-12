const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Raffle...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    console.log(90);
    const multiSigAdmin = await MultiSigAdmin.attach("0xb1E95C89893354C5A0Dbff233d56cB072E03ce78");
    console.log(91);

    // const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    // const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    // await raffleHelper.deployed();
    // console.log("raffleHelper.address :", raffleHelper.address);
    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.attach("0x20366BaE0D21943457C61fE401a34Ef26581570B");
    console.log("raffleHelper.address :", raffleHelper.address);

    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [30, 200, 400], [150, 300]);

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
    
    await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", tomorrow + "");
    console.log(2);
    
    multiSigAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(3);
}

main();