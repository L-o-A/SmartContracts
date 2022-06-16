const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const capsule = "0x995e7F6be8e53419f8e1A01E97332131B510E5fb";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 - 86400  + "");

    await raffle.setRaffleData(1, twoDaysAgo + "", oneDayAgo + "", capsule, treasury);
    console.log("raffle closed")
    
    await raffle.pickWinner(10);
    console.log("winners declared")
}

main();