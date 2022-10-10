const { ethers, upgrades } = require("hardhat");

function getRandomNumber() {
    return parseInt(Math.random() * 10**10) + "" + parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" + parseInt(Math.random() * 10**10) + "";
}

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0xdCf6114e901B5a8664657e3bC0Cb6a752d46d6a0";
    const _UTIL_address = "0x02714591a7b03A6c2633b4f398A3585541ce16aa";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    const LOAUtil = await ethers.getContractFactory("LOAUtil");
    const _LOAUtil = await LOAUtil.attach(_UTIL_address);


    // const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    // const oneDayAgo = parseInt(new Date().getTime() / 1000 - 86400 + "");
    // const now = parseInt(new Date().getTime() / 1000);
    // await raffle.setRaffleInfo(1, twoDaysAgo + "", oneDayAgo + "", now + "");
    // return;


    // let randoms = [];
    // for(let i =0; i < 400; i++) randoms.push(getRandomNumber());
    // await _LOAUtil.fullfillRandom("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", randoms);


    console.log("raffle closed")
    await raffle.pickWinner(100);
    await raffle.pickWinner(100);
    await raffle.pickWinner(100);
    // await raffle.pickWinner(100);

    // await raffle.terminate();
    console.log(2);
}

main();