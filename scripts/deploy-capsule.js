const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Capsule...");

    const multiSigAdminAddr = "0x590CD0257F0D69dEb54E49122Fcef746d8a2720e";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"


    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    // const capsuleData = await CapsuleData.attach("0x476a09d8D4a774d908D75FDa81E88Cb880F280a6");
    const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    await capsuleData.deployed()
    console.log("capsuleData.address :", capsuleData.address);

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(multiSigAdmin.address);
    await capsule.deployed()
    console.log("capsule.address :", capsule.address);

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
    await capsuleStaking.deployed()
    console.log("capsuleStaking.address :", capsuleStaking.address);

    // await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    console.log(6);

    console.log(7);
    // await multiSigAdmin.setCapsuleAddress(capsule.address);
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);

}

main();