const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Staking Pool...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const gq = "0xf4d2FBBaD7018761284936CD87263158F3deFeBe";

    // const MYERC20 = await ethers.getContractFactory("MYERC20");
    // const _gq = await MYERC20.deploy("GQ", "GQ");
    // await _gq.deployed();
    // console.log("_gq.address :", _gq.address);


    const PartnerStaking = await ethers.getContractFactory("PartnerStaking");
    const _PartnerStaking = await PartnerStaking.deploy(gq ,loa);
    await _PartnerStaking.deployed();
    console.log("_PartnerStaking.address :", _PartnerStaking.address);


    // await _PartnerStaking.addAdmin();
    await _PartnerStaking.setTresury("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    console.log(1);
    await _PartnerStaking.setRewardsPerSecond("643000000000000000");
    console.log(2);
    await _PartnerStaking.updateWithdrawalFee([30],[30, 30]);
    console.log(3);
    await _PartnerStaking.setTimelineLimits("1650815200", "1658817900", "1658817000", "16666670000000000000000", "50000000000000000000000");
    console.log(4);
    
}

main();