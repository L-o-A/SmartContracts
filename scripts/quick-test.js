const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    // const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // await raffle.pickWinner(100);

    loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0xe01D32D0b93326adec15543Fa3F7a1f700F67e59");

    // await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    // await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.setNFTAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    // await multiSigAdmin.setCapsuleAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setAxionAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");


    const Capsule = await ethers.getContractFactory("Capsule");
    const _Capsule = await Capsule.attach("0xdcf3c8EC638E881555031DB9c590F82eC4928136");

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _CapsuleData = await CapsuleData.attach("0xb6f8eE0844c2517064766AdF7a5830E826952aCA");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const _CapsuleStaking = await CapsuleStaking.attach("0x9217e76678153f4bd2bf6BCFd5C4cb41D74DdafE");

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0x9a3C3816f77458e60b87dbbD395FcC13794e1833");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0xB21BAB7fcbae465C4d4dE59b6d8002371707FB66");

    // console.log(await _Capsule.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "66"));
    // console.log(await _Capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 20));
    // console.log(await _Capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 20));
    // console.log(await _Capsule.airdrop(3, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 20));

    console.log(await multiSigAdmin.getNFTDataAddress());
    // await multiSigAdmin.setCapsuleAddress(_Capsule.address);
    // await multiSigAdmin.setCapsuleDataAddress(_CapsuleData.address);



    let capsules = await _CapsuleData.getUserCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    console.log(capsules);
    
    // for(level = 1; level < 10; level++) {
    //     if(level == 7) continue;
    //     for(hero = 1; hero < 11; hero++) {
    //         await _LoANFTData.populateAttributeReserve(level, hero, 5);
    //         console.log("processed ", level, hero);
    //     }
    // } // 0.7 BnB for 500

    // console.log(await _CapsuleData._capsule_status(5));
    
    // await loa.approve(_CapsuleStaking.address, "200000000000000000000000000000");
    // await _Capsule.setApprovalForAll(_CapsuleStaking.address, true);
    // await _CapsuleStaking.stake(capsules);

    // capsules = await _CapsuleStaking.fetchStakedCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB")
    // await _CapsuleStaking.reclaim(capsules, false);
    
    // console.log(await _LoANFTData.getNFTSupply(1));
    // console.log(await _LoANFTData.populateAttribute(11422, 2, 3));
    // console.log(await _LoANFTData.getNewNFTByLevel(2));
    // console.log(await _LoANFTData.doMint(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB"));

    
    // await loa.approve(_LoANFT.address, "2000000000000000000000000");
    // await _Capsule.setApprovalForAll(_LoANFT.address, true);

    // let tx = await _LoANFT.mint(11);
    // let rc = await tx.wait();
    // let event = rc.events.find(event => event.event === 'NFTMinted');
    // console.log(event.args.itemIds.toString(), event.args.capsuleIds, event.args.buyer, event.args.price);


    
    // console.log(await _LoANFTData.getUserNFTs("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB"));
    console.log(await _LoANFTData._user_holdings("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 0));



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