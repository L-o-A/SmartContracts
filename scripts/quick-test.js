const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    // const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // await raffle.pickWinner(100);

    loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x830fd6c2686813084eE5C762cfcdfe91E794319b");

    // await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    // await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.setNFTAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    // await multiSigAdmin.setCapsuleAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setAxionAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");


    const Capsule = await ethers.getContractFactory("Capsule");
    const _Capsule = await Capsule.attach("0xFc1C177676edB0e5915E11145556C7C47C1b2cB5");

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _CapsuleData = await CapsuleData.attach("0x9949f34ACAe53d3Ee1Fb1F45277292B5e3A0ef3f");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const _CapsuleStaking = await CapsuleStaking.attach("0xf7c71c4D9253A52794CD0BBc736a54C1e404eC50");

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0xC827616F07C0E3BB8602AAB1a70A7CF1dA38DCd3");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0xBB58bDD791C453b2DE786cC536D84aEe9F7b3Eb5");

    // console.log(await _Capsule.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "66"));
    // console.log(await _Capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2));
    // console.log(await _Capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2));

    console.log(await multiSigAdmin.getCapsuleAddress());
    // await multiSigAdmin.setCapsuleAddress(_Capsule.address);
    // await multiSigAdmin.setCapsuleDataAddress(_CapsuleData.address);

    console.log("getCapsuleDataAddress ", await multiSigAdmin.getCapsuleDataAddress());


    let capsules = await _CapsuleData.getUserCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    console.log(capsules);
    
    // for(level = 1; level < 10; level++) {
    //     if(level == 7) continue;
    //     for(hero = 1; hero < 11; hero++) {
    //         await _LoANFTData.populateAttributeReserve(level, hero, 5);
    //         console.log("processed ", level, hero);
    //     }
    // } // 0.7 BnB for 500

    console.log(await _CapsuleData._capsule_status(2));
    // console.log(await _CapsuleData._capsule_status(5));
    
    // await loa.approve("0x5D005826c5b5C9144cFF11770c38Fcb24338Cb89", "200000000000000000000000000000");
    // await _Capsule.setApprovalForAll("0x5D005826c5b5C9144cFF11770c38Fcb24338Cb89", true);
    // await _CapsuleStaking.stake(capsules);

    // capsules = await _CapsuleStaking.fetchStakedCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB")
    // await _CapsuleStaking.reclaim(capsules, false);
    
    // console.log(await _LoANFTData.getNFTSupply(1));
    // console.log(await _LoANFTData.populateAttribute(11422, 2, 3));
    // console.log(await _LoANFTData.getNewNFTByLevel(2));
    // console.log(await _LoANFTData.doMint(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB"));

    
    // await loa.approve("0xC827616F07C0E3BB8602AAB1a70A7CF1dA38DCd3", "2000000000000000000000000");
    // await _Capsule.setApprovalForAll("0xC827616F07C0E3BB8602AAB1a70A7CF1dA38DCd3", true);

    let tx = await _LoANFT.mint([2,3]);
    let rc = await tx.wait();
    let event = rc.events.find(event => event.event === 'NFTMinted');
    console.log(event.args.itemIds.toString(), event.args.capsuleIds, event.args.buyer, event.args.price);


    
    console.log(await _LoANFTData.getUserNFTs("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB"));



    // console.log(await _LoANFT.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "1"));
    // console.log(await _LoANFT.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "2"));
    
    // console.log(await _CapsuleData.getNewCapsuleIdByType(1));
    // console.log(await _CapsuleData.getUserCapsules("0xe3d6E76fE17f514a642EE003b24F8C0Ed614A286"));
    
    // await _Capsule.airdrop(1, "0xe3d6E76fE17f514a642EE003b24F8C0Ed614A286", 1 );
    
    // console.log(await _CapsuleData.getUserCapsules("0xe3d6E76fE17f514a642EE003b24F8C0Ed614A286"));

    
    // await admin.modifyAdmin("0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D", true);

    // await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5,6,7,8,9,10], ["1-0-0", "1-2-0", "1-3-0", "1-4-0", "1-5-0", "2-0-1", "2-0-1", "2-0-1", "2-2-1", "2-0-2"]);
    // console.log(12);

    // await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");

    // const StringUtil = await ethers.getContractFactory("StringUtil");
    // const stringUtil = await StringUtil.deploy();
    // await stringUtil.deployed();

    // console.log(await stringUtil.split("10-20-30"));
}

main();