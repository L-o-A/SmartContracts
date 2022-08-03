const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Staking Pool...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const gq = "0xf4d2FBBaD7018761284936CD87263158F3deFeBe";
    const busd_loa = "0x403467d3eb13e0AAAefa3e1150b4207b586DbB2b";

    // const MYERC20 = await ethers.getContractFactory("MYERC20");
    // const _gq = await MYERC20.deploy("GQ", "GQ");
    // await _gq.deployed();
    // console.log("_gq.address :", _gq.address);

    // const _gq = await (await ethers.getContractFactory("MYERC20")).attach(gq);
    
    // await _gq.mint("1792375000")
    
    
    // const PartnerStaking = await ethers.getContractFactory("PartnerStaking");
    // const _PartnerStaking = await PartnerStaking.deploy("0xF700D4c708C2be1463E355F337603183D20E0808", "0x94b69263fca20119ae817b6f783fc0f13b02ad50");
    // await _PartnerStaking.deployed();
    // console.log("_PartnerStaking.address :", _PartnerStaking.address);
    const _PartnerStaking = await (await ethers.getContractFactory("PartnerStaking")).attach("0xd832b939D63262e60D5Ee9BfAf076e2324a5Af03");



    // await _PartnerStaking.addAdmin("0x587c9B1F39F2f703E75c86D1eCEE5Cf28BF27326"); //KEN
    // await _PartnerStaking.withdraw(); //KEN
    // await _PartnerStaking.extract(gq); //KEN
    // await _PartnerStaking.extract(loa); //KEN
    await _PartnerStaking.setTresury("0xa25e78aACd83B6f6b3aD378667eb79484118b942");
    // // console.log(1);
    await _PartnerStaking.setRewardsPerSecond("626929000000000000");
    // // console.log(2);
    await _PartnerStaking.updateWithdrawalFee([30],[30, 30]);
    // // console.log(3);
    // await _PartnerStaking.setTimelineLimits("0", "0", "0", "0", "0");
    await _PartnerStaking.setTimelineLimits("1659081600", "1661673600", "1659254400", "3088700000000000000000", "9266120000000000000000");
    // console.log(4);
    
}

main();
