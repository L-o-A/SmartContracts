const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Raffle...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";

    const capsule = "0x3E1dA04d9B960083999B7AD148A19590B8b1Bce9";

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x2cB56ca188e99986E6D709433a96C957c01Edd71");
    

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    await raffleHelper.deployed();
    console.log("raffleHelper.address :", raffleHelper.address);
    // const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    // const raffleHelper = await RaffleHelper.attach("0x3D8ac6D97571dD2EAf20B9Fe6d25e4beA5D0C4ef");
    // console.log("raffle.address :", raffleHelper.address);

    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa, raffleHelper.address);
    await raffle.deployed();
    console.log("raffle.address :", raffle.address);
    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach("0xe5f0696c40Ff4A5C5ad42F69d79b27015dec6fC8");
    // console.log("raffle.address :", raffle.address);


    await raffleHelper.setRaffle(raffle.address);
    // console.log(1);

    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 + 2* 86400  + "");
    
    await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", oneDayAgo + "");
    console.log(2);
    
    multiSigAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(3);
}

main();