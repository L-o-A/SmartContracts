const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0x830fd6c2686813084eE5C762cfcdfe91E794319b";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"

    const nft = "0xDb55845EA253A5a22Ce194b147ef6F0bF111E747";

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(multiSigAdmin.address);
    await capsule.deployed()
    console.log("capsule.address :", capsule.address);

   
    await capsule.modifyCapsules(true, [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
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

}

main();