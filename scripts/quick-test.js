const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    // const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // await raffle.pickWinner(100);

    loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x66A86D15849f39E461Ae4B23e9CF1aa8ED66D1Fc");

    // await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    // await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.setNFTAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    // await multiSigAdmin.setCapsuleAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setAxionAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");


    const Capsule = await ethers.getContractFactory("Capsule");
    const _Capsule = await Capsule.attach("0x0583A78979CD8F12Eb5B1B1F55a957D5Cefe7567");

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _CapsuleData = await CapsuleData.attach("0x1D75E5855b752733C9bfF33848e127323aDb4A23");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const _CapsuleStaking = await CapsuleStaking.attach("0x744c927F01C8C04883A5c651ee9bff2f2854a55B");

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0x142AdBb712C9e152038B338207b641eb697720CD");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0xf989A58F93346eb78Ab07Afc12cE13C01d932c40");

    // console.log(await _Capsule.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "66"));
    // console.log(await _Capsule.airdrop(1, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 20));
    // return;
    // console.log(await _Capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 20));
    // console.log(await _Capsule.airdrop(3, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 20));

    // await multiSigAdmin.setAxionAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");

    // console.log(await multiSigAdmin.getAxionAddress());
    // await multiSigAdmin.setNFTAddress("0xffc9a7cd3b88d37d705b1c1ce8bd87b13baa59fb"); // me
    // await multiSigAdmin.setNFTDataAddress("0xf989A58F93346eb78Ab07Afc12cE13C01d932c40"); // original
    // await multiSigAdmin.setNFTAddress("0x142AdBb712C9e152038B338207b641eb697720CD"); // original
    console.log(await multiSigAdmin.getNFTAddress());
    console.log(await multiSigAdmin.getNFTDataAddress());

    // await loa.approve(_LoANFT.address, "200000000000000000000000000000");

    // console.log(await loa.allowance("0xffc9a7cd3b88d37d705b1c1ce8bd87b13baa59fb", _LoANFT.address));

    // for(let i = 0; i < 10; i++){
    //     console.log(await multiSigAdmin.random(100, i +1));
    // }

    // console.log(await _CapsuleData.getCapsuleDetail(762));
    console.log(await _LoANFTData._minting_fee(1));
    console.log(await _LoANFTData._minting_fee(2));
    console.log(await _LoANFTData._minting_fee(3));
    console.log(await _LoANFTData._minting_fee(4));
    console.log(await _LoANFTData._minting_fee(5));
    console.log(await _LoANFTData._minting_fee(6));
    console.log(await _LoANFTData._minting_fee(7));


    // console.log(await _LoANFT.mint(762));
    // console.log(await _LoANFTData.populateAttribute(762, 3, 6));
    // console.log(await _Capsule.balanceOf("0xffc9a7cd3b88d37d705b1c1ce8bd87b13baa59fb", 762));
    // console.log(await _CapsuleData.getCapsuleDetail(762));

    // let tx = await _LoANFT.mint(762);
    // console.log(tx);
    // let rc = await tx.wait();
    // console.log(rc);
    // let event = rc.events.find(event => event.event === 'Minted');
    // console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());

    // await multiSigAdmin.setCapsuleAddress(_Capsule.address);
    // await multiSigAdmin.setCapsuleDataAddress(_CapsuleData.address);



    // let capsules = await _CapsuleData.getUserCapsules("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da");
    // console.log("capsules", capsules);
    
    // for(level = 1; level < 10; level++) {
    //     if(level == 7) continue;
    //     for(hero = 1; hero < 11; hero++) {
    //         await _LoANFTData.populateAttributeReserve(level, hero, 5);
    //         console.log("processed ", level, hero);
    //     }
    // } // 0.7 BnB for 500

    // console.log(await _CapsuleData._capsule_status(5));
    
    
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
    // console.log("_user_holdings", await _LoANFTData._user_holdings("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 0));



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