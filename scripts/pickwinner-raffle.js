const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    // const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // await raffle.pickWinner(100);

    // const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    // const multiSigAdmin = await MultiSigAdmin.attach("0x131BE3C41ACa0Cc12D6f6B7B14eD515871E70986");

    // await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    // await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.setNFTAddress(_LoANFT.address);
    // await multiSigAdmin.setCapsuleAddress(capsule.address);
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);


    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.attach("0xfC0706c80c9523EFC1fD8B409cCa12886f89389f");
    
    // await admin.modifyAdmin("0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D", true);

    await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5,6,7,8,9,10], ["1-0-0", "1-2-0", "1-3-0", "1-4-0", "1-5-0", "2-0-1", "2-0-1", "2-0-1", "2-2-1", "2-0-2"]);
    console.log(12);

    // await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");

    // const StringUtil = await ethers.getContractFactory("StringUtil");
    // const stringUtil = await StringUtil.deploy();
    // await stringUtil.deployed();

    // console.log(await stringUtil.split("10-20-30"));
}

main();