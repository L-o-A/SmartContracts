const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("RAFFLE ", function () {



  it("RAFFLE Test -5", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.deploy();
    await multiSigAdmin.deployed();
    
    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    await capsuleData.deployed();



    await ethers.provider.send("evm_increaseTime", [3600]);

    console.log("--")


    await ethers.provider.send("evm_increaseTime", [3600]);

    await capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
    await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
    

    // console.log("randomMultiple of 5", await capsuleData.randomMultiple([20,30,40,50,60],3, 1));
    // console.log("randomMultiple of 5", await capsuleData.randomMultiple([20,30,40,50,60],3, 2));
    // console.log("randomMultiple of 5", await capsuleData.randomMultiple([20,30,40,50,60],3, 3));
    // console.log("randomMultiple of 5", await capsuleData.randomMultiple([20,30,40,50,60],3, 4));


  });


});


