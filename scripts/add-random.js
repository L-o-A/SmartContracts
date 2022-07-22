const { expect } = require("chai");
const { ethers } = require("hardhat");

async function main() {
    console.log("Random Insert...");

    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
    const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const multiSigAdmin_addr = "0x0f22A63835ed8b852C09b557c7E7B3E08AdA44bA"//"0x69255d0a9a71541a8E71ea67E1fA100b91CB2e99";//"0xfc5eC1194A3E69c6Fc6dcB5FFDDb17716214E96B";

    let multiSigAdmin;
    if (multiSigAdmin_addr != null) {
        multiSigAdmin = await (await ethers.getContractFactory("MultiSigAdmin")).attach(multiSigAdmin_addr);
        console.log("multiSigAdmin.address :", multiSigAdmin.address);
    } else {
        multiSigAdmin = await (await ethers.getContractFactory("MultiSigAdmin")).deploy();
        await multiSigAdmin.deployed();
        console.log("multiSigAdmin.address :", multiSigAdmin.address);

        await multiSigAdmin.modifyAdmin(admin2, true);
        await multiSigAdmin.modifyAdmin(admin3, true);
        await multiSigAdmin.modifyAdmin(treasury, true);
        await multiSigAdmin.setTreasury(treasury);
    }
    // await multiSigAdmin.setAxionAddress(admin3);

    // for (let j = 0; j < 10; j++) {
    //     let rands = [];
    //     for (let i = 0; i < 10; i++) {
    //         rands.push(Math.floor((Math.random() * 4000000000) + 1) + "");
    //     }

    //     await multiSigAdmin.setRandomValues(rands);
    //     console.log(j, "------------------------------");
    // }

    // console.log("---------0-------", await multiSigAdmin.getArray(0));
    // console.log("----------1------", await multiSigAdmin.getArray(1));
    // console.log("---------2-------", await multiSigAdmin.getArray(2));
    // console.log("---------_random_values-------", await multiSigAdmin._random_values[0, 0]);
    // console.log("--------_max_rand_index--------", await multiSigAdmin._max_rand_index());
    // console.log("---------random-------", await multiSigAdmin.random(10, 1, 1 + 1));

    console.log("----------------", await multiSigAdmin.getArray(100, 10000, 10));
}
main();