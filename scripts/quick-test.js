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
    const _Capsule = await Capsule.attach("0x95acb7F921e9fA8aF5e617e07A9Dd5b9656c8F94");

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _CapsuleData = await CapsuleData.attach("0x1323583789EF04Dbabd4c0175A15F96c8015956b");

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const _CapsuleStaking = await CapsuleStaking.attach("0x5D005826c5b5C9144cFF11770c38Fcb24338Cb89");

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0xA209301bEc49D77a966f986fD434eae4Ea9A457A");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0xb252b7247CD8f137f9B31a579B56005d002EbD5C");


    // console.log(await _Capsule.balanceOf("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", "66"));
    // console.log(await _Capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 10));
    // console.log(await _Capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 10));

    let capsules = await _CapsuleData.getUserCapsules("0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB")
    console.log(capsules);
    
    // await _LoANFTData.populateAttributeReserve(1, 1, 10);
    // await _LoANFTData.populateAttributeReserve(1, 2, 10);
    
    // console.log(await _CapsuleData._capsule_status(4));
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

    // await _LoANFTData.addNFTSupply(2, [1, 2 ], [10, 10]);
    // await _LoANFTData.addNFTSupply(3, [1, 2 ], [10, 10]);
    // await _LoANFTData.addNFTSupply(4, [1, 2 ], [10, 10]);
    // await _LoANFTData.addNFTSupply(5, [1, 2 ], [10, 10]);
    // await _LoANFTData.addNFTSupply(6, [1, 2 ], [10, 10]);
    // await _LoANFTData.addNFTSupply(8, [1, 2 ], [10, 10]);

    // await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(5, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(5, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(6, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(6, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(8, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    // await _LoANFTData.addNFTAttributeLimits(8, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    

    
    await loa.approve("0xA209301bEc49D77a966f986fD434eae4Ea9A457A", "2000000000000000000000000");
    await _Capsule.setApprovalForAll("0xA209301bEc49D77a966f986fD434eae4Ea9A457A", true);

    let tx = await _LoANFT.mint([6]);
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