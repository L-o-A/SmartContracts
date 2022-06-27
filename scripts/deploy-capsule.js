const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0x2cB56ca188e99986E6D709433a96C957c01Edd71";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"


    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    await capsuleData.deployed()
    console.log("capsuleData.address :", capsuleData.address);


    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(multiSigAdmin.address);
    await capsule.deployed()
    console.log("capsule.address :", capsule.address);

   
    await capsuleData.modifyCapsules(true, [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    console.log(5);


    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
    await capsuleStaking.deployed()
    console.log("capsuleStaking.address :", capsuleStaking.address);

    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    console.log(6);

    await capsuleStaking.setAddresses(capsule.address);
    console.log(7);


    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);

}

main();