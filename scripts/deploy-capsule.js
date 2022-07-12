const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Capsule...");

    const multiSigAdminAddr = "0xb1E95C89893354C5A0Dbff233d56cB072E03ce78";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"


    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    // const capsuleData = await CapsuleData.attach("0x476a09d8D4a774d908D75FDa81E88Cb880F280a6");
    const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    await capsuleData.deployed()
    console.log("capsuleData.address :", capsuleData.address);

    // await capsuleData.testWrite();


    // const Capsule = await ethers.getContractFactory("Capsule");
    // const capsule = await Capsule.deploy(multiSigAdmin.address);
    // await capsule.deployed()
    // console.log("capsule.address :", capsule.address);


    // await capsuleData.modifyCapsules(true, [1], [1], [2]);
    console.log(5);


    // const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    // const capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
    // await capsuleStaking.deployed()
    // console.log("capsuleStaking.address :", capsuleStaking.address);

    // await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    console.log(6);

    // await capsuleStaking.setAddresses(capsule.address);
    console.log(7);


    // await multiSigAdmin.setCapsuleAddress(capsule.address);
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);

}

main();