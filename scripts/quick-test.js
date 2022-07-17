const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Picking Raffle Winners...");

    // const RAFFLE_ADDRESS = "0x9E39644DC0DFAc95096904B5314Ec483dF92Ef7F";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // await raffle.pickWinner(100);

    loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x590CD0257F0D69dEb54E49122Fcef746d8a2720e");

    // await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    // await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.setNFTAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    // await multiSigAdmin.setCapsuleAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");
    // await multiSigAdmin.setAxionAddress("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB");


    const Capsule = await ethers.getContractFactory("Capsule");
    const _Capsule = await Capsule.attach("0x51E3b667F9f456C90C145f016c42B19563B30eC3");

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _CapsuleData = await CapsuleData.attach("0x2E00f4cd700822E787421F2C62F7ef1AC2591f24");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const _CapsuleStaking = await CapsuleStaking.attach("0xDF258a0D591c2BD2cc1b7f287dD543811bC23a5C");

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0xfd1C17851259A13Edb03640D346A8ebcA71D17BB");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0x1568213c6Da66aAe47c57fee138481025c333268");

    console.log(await multiSigAdmin.isValidMarketPlaceContract("0xfd1C17851259A13Edb03640D346A8ebcA71D17BB"))

    // console.log(await _Capsule.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "66"));
    // console.log(await _Capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 10));
    // console.log(await _Capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 10));
    // let capsules = await _CapsuleData.getUserCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB")
    // console.log(capsules);

    // console.log(await _CapsuleData._capsule_status(1));
    // console.log(await _CapsuleData._capsule_status(2));
    
    // await loa.approve("0xDF258a0D591c2BD2cc1b7f287dD543811bC23a5C", "2000000000000000000000000000");
    // await _Capsule.setApprovalForAll("0xDF258a0D591c2BD2cc1b7f287dD543811bC23a5C", true);
    // await _CapsuleStaking.stake([1,2,3,4,5]);
    // await _CapsuleStaking.reclaim([1,2,3,4,5], false);
    
    // console.log(await _LoANFTData.getNFTSupply(1));
    // console.log(await _LoANFTData.populateAttribute(11422, 2, 3));
    // console.log(await _LoANFTData.getNewNFTByLevel(2));
    // console.log(await _LoANFTData.doMint(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB"));
    
    await loa.approve("0xfd1C17851259A13Edb03640D346A8ebcA71D17BB", "2000000000000000000000000");
    await _Capsule.setApprovalForAll("0xfd1C17851259A13Edb03640D346A8ebcA71D17BB", true);

    let tx = await _LoANFT.mint(3);
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