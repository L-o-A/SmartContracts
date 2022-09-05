const { expect } = require("chai");
const { ethers } = require("hardhat");


function getRandomNumber() {
    return parseInt(Math.random() * 10**10) + "" + parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" +parseInt(Math.random() * 10**10) + "" + parseInt(Math.random() * 10**10) + "";
}

async function main() {
    console.log("Random Insert...");

    // console.log(getRandomNumber());
    // console.log(getRandomNumber());
    // console.log(getRandomNumber());
    // return;

    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
    const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const multiSigAdmin_addr = "0x0f22A63835ed8b852C09b557c7E7B3E08AdA44bA"//"0x69255d0a9a71541a8E71ea67E1fA100b91CB2e99";//"0xfc5eC1194A3E69c6Fc6dcB5FFDDb17716214E96B";

    const _loa_util = "0x02714591a7b03A6c2633b4f398A3585541ce16aa";

    const loa_util = await (await ethers.getContractFactory("LOAUtil")).attach(_loa_util);
    console.log("loa_util.address :", loa_util.address);

    // await loa_util.requestRandom(10);
    // console.log(1);
    // let randoms = [];
    // for(let i =0; i < 100; i++) randoms.push(getRandomNumber());
    // await loa_util.fullfillRandom("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", randoms);
    // console.log(2);


    const Capsule = await ethers.getContractFactory("Capsule");
    let capsule = await Capsule.attach("0xA73e9831f329a1D8885Be104B237439b32D6AfCb");
    console.log("capsule.address :", capsule.address);

    await capsule.airdrop(2, "0x6Be64f65DAfe540354CB8bFe6D7eE0Bbdcd67A25", 2);

}
main();