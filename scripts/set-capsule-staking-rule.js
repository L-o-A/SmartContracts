const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.attach("0xe790207bA0512Ef30D6B5A1ECbCA0FEbA9aD06d4");
    console.log("capsuleStaking.address :", capsuleStaking.address);

    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(2, 0, "2000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(3, 0, "3000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(4, 0, "4000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(5, 0, "5000000000000000000000");
    console.log(6);
}

main();