const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0x2cB56ca188e99986E6D709433a96C957c01Edd71";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"


    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);



    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
    await capsuleStaking.deployed()
    console.log("capsuleStaking.address :", capsuleStaking.address);

    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    console.log(6);

    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
}

main();