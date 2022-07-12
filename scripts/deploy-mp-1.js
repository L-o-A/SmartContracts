const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
   //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN
    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
    const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const multiSigAdmin_addr = '0x44765D53328CaD452ecc90E5864524C7a9e5111B';
    const raffleHelper_addr = '0x59cf060cF826fBF12A34eb58bD00F9F959f72828';
    const raffle_addr = '0x86a47f7FF6D28Bc1F8aa16b823D1C2FB855DB174';
    const capsule_addr = '0x93185DD95d636a7bd6deb3cC4B956CEA18f02432';
    const capsuleData_addr = '0x51Bb854F0794B9b5d8723715cae65da23b896e56';
    const capsuleStaking_addr = '0x0987AFEe94Ec81A6F6e7d4b354bd8085dbe97618';
    const _LoANFTData_addr = '0xaa830E7B5061E81083aF344777709C3E6DB7FA4A';
    const _LoANFT_addr = '0x5B3127585Cea15cB600f350C1CF220364dB9DD1d';
    const _LoANFTFusion_addr = '0x931B14d652A9d37E1D0B1f30E684fd63Be048bc8';
    const _NFTMarket_addr = '0x05C8F08ce73422f468426ff784b81776d55e64e9';


    let multiSigAdmin;
    if(multiSigAdmin_addr != null) {
        const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
        multiSigAdmin = await MultiSigAdmin.attach(multiSigAdmin_addr);
        console.log("multiSigAdmin.address :", multiSigAdmin.address);
    } else {
        const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
        multiSigAdmin = await MultiSigAdmin.deploy();
        await multiSigAdmin.deployed();
        console.log("multiSigAdmin.address :", multiSigAdmin.address);

        await multiSigAdmin.modifyAdmin(admin2, true);
        await multiSigAdmin.modifyAdmin(admin3, true);
        await multiSigAdmin.modifyAdmin(treasury, true);
        await multiSigAdmin.setTreasury(treasury);
    }


    let raffleHelper;
    if(raffleHelper_addr  == null) {
        const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
        raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
        await raffleHelper.deployed();
        console.log("raffleHelper.address :", raffleHelper.address);
    } else {
        const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
        raffleHelper = await RaffleHelper.attach(raffleHelper_addr);
        console.log("raffleHelper.address :", raffleHelper.address);
    }


    let raffle;
    if(raffle_addr == null) {
        const Raffle = await ethers.getContractFactory("Raffle");
        raffle = await Raffle.deploy(loa, raffleHelper.address, multiSigAdmin.address);
        await raffle.deployed();
        console.log("raffle.address :", raffle.address);
    } else {
        const Raffle = await ethers.getContractFactory("Raffle");
        raffle = await Raffle.attach(raffle_addr);
        console.log("raffle.address :", raffle.address);
    }

    let capsule;
    if(capsule_addr == null) {
        const Capsule = await ethers.getContractFactory("Capsule");
        capsule = await Capsule.deploy(multiSigAdmin.address);
        await capsule.deployed()
        console.log("capsule.address :", capsule.address);
    } else {
        const Capsule = await ethers.getContractFactory("Capsule");
        capsule = await Capsule.attach(capsule_addr);
        console.log("capsule.address :", capsule.address);
    }

    let capsuleData;
    if(capsuleData_addr == null) {
        const CapsuleData = await ethers.getContractFactory("CapsuleData");
        capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
        await capsuleData.deployed()
        console.log("capsuleData.address :", capsuleData.address);
    } else {
        const CapsuleData = await ethers.getContractFactory("CapsuleData");
        capsuleData = await CapsuleData.attach(capsuleData_addr);
        console.log("capsuleData.address :", capsuleData.address);
    }

    let capsuleStaking;
    if(capsuleStaking_addr == null) {
        const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
        capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
        await capsuleStaking.deployed()
        console.log("capsuleStaking.address :", capsuleStaking.address);
    } else {
        const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
        capsuleStaking = await CapsuleStaking.attach(capsuleStaking_addr);
        console.log("capsuleStaking.address :", capsuleStaking.address);
    }

    let _LoANFTData;
    if(_LoANFTData_addr == null){
        const LoANFTData = await ethers.getContractFactory("LoANFTData");
        _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
        await _LoANFTData.deployed()
        console.log("_LoANFTData.address :", _LoANFTData.address);
    } else {
        const LoANFTData = await ethers.getContractFactory("LoANFTData");
        _LoANFTData = await LoANFTData.attach(_LoANFTData_addr);
        console.log("_LoANFTData.address :", _LoANFTData.address);
    }

    let _LoANFT;
    if(_LoANFT_addr == null) {
        const LoANFT = await ethers.getContractFactory("LoANFT");
        _LoANFT = await LoANFT.deploy(loa, multiSigAdmin.address, _LoANFTData.address);
        await _LoANFT.deployed()
        console.log("_LoANFT.address :", _LoANFT.address);
    } else {
        const LoANFT = await ethers.getContractFactory("LoANFT");
        _LoANFT = await LoANFT.attach(_LoANFT_addr);
        console.log("_LoANFT.address :", _LoANFT.address);
    }
    
   

    let _LoANFTFusion;
    if(_LoANFTFusion_addr == null){
        const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
        _LoANFTFusion = await LoANFTFusion.deploy(loa, _LoANFT.address, multiSigAdmin.address);
        await _LoANFTFusion.deployed()
        console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    } else {
        const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
        _LoANFTFusion = await LoANFTFusion.attach(_LoANFTFusion_addr);
        console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    }
    
    let _NFTMarket;
    if(_NFTMarket_addr == null) {
        const NFTMarket = await ethers.getContractFactory("NFTMarket");
        _NFTMarket = await NFTMarket.deploy(loa, multiSigAdmin.address);
        await _NFTMarket.deployed()
        console.log("_NFTMarket.address :", _NFTMarket.address);
    } else {
        const NFTMarket = await ethers.getContractFactory("NFTMarket");
        _NFTMarket = await NFTMarket.attach(_NFTMarket_addr);
        console.log("_NFTMarket.address :", _NFTMarket.address);
    }

    console.log(1);

    


    await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
    await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);
    await multiSigAdmin.setNFTAddress(_LoANFT.address);

    await multiSigAdmin.modifyRaffleAddress(raffle.address, true);


    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);


    await raffleHelper.setRaffle(raffle.address);
    console.log(2);

    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const tomorrow = parseInt(new Date().getTime()/1000 + 2* 86400  + "");
    const future = parseInt(new Date().getTime()/1000 + 20* 86400  + "");

    const raffleStatus = await raffle._raffle_status();
    if(raffleStatus == 0){
        await raffle.setRaffleInfo(1, twoDaysAgo + "", tomorrow + "", future + "");
    }
    console.log(3);

    console.log(4);


    // await capsuleData.modifyCapsules(true, [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    console.log(5);
    
    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(2, 0, "2000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(3, 0, "3000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(4, 0, "4000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(5, 0, "5000000000000000000000");
    console.log(6);


    await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);
    console.log(8);

    // await _LoANFTData.modifyNFTs(true, [1,2,3,4,5,6,7,8,9,10], [1,1,1,1,1,1,1,1,1,1], [1,2,1,2,1,2,1,2,1,2],[1,1,1,1,1,1,1,1,1,1]);
    console.log(9);

    await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);

    console.log(11);

    /**
     * function putNFTAttributes (uint256[] memory ids, string[] memory attribs)
     */
    //  await _LoANFTData.putNFTAttributes([1,2,3,4,5], 
    //   [
    //       "1-3-4-1-0-0-0-0-6-7-8",
    //       "2-4-0-0-0-0-4-5-6-7-8",
    //       "3-5-6-3-0-0-0-0-7-8-2",
    //       "4-6-7-4-2-3-0-0-0-0-3",
    //       "5-7-8-5-2-3-4-0-0-0-0",
    //   ]);

    // await _LoANFTData.putNFTAttributes([6, 7, 8, 9, 10],
    //      [
    //          "1-3-0-0-0-0-4-5-6-7-8",
    //          "2-4-5-0-0-0-0-5-6-7-8",
    //          "3-5-6-3-2-0-0-0-0-8-1",
    //          "4-6-7-4-0-0-0-0-7-8-1",
    //          "5-7-8-5-2-3-0-0-0-0-2",
    //      ]);
     console.log(12);


    /**
     * function createFusionRule(
        uint256 id,
        uint256 price,
        uint8 resultLevel,
        uint8[] memory levelValues
    )
     */
    // await _LoANFTFusion.createFusionRule(1, "1000000000000000000000", 2, [1,1]);
    console.log(13);

    /**
     * function updateFees (
        address[] memory contractAddresses, 
        uint256[] memory fees)
     */
    await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["200000000000000000000", "100000000000000000000"], [50, 50]);
    console.log(14);
    

   //  await capsule.airdrop(1, admin2, 4);
    console.log(15.1);

   return;
    ///---------------------------------------
    const MYERC20 = await ethers.getContractFactory("MYERC20");
    const _loa = await MYERC20.attach(loa);
    
    await _loa.approve(raffle.address, "10000000000000000000000")
    console.log(15.2);
    await raffle.buyTicket(10);
    console.log(15.3);

    await raffle.setRaffleInfo(1, 10, 100000, 100000);
    console.log(16);
    
    await raffle.pickWinner(10);
    console.log(17);
    
    await raffle.withdraw(loa);
    console.log(18);
    
    const caps = await capsule.getUserCapsules(treasury);
    console.log(caps);
    console.log(19);
    
    await capsuleStaking.stake([caps[0], caps[1]]);
    console.log(20);
    
    await capsuleStaking.reclaim([caps[0], caps[1]], false);
    console.log(21);
    
    await _loa.approve(_LoANFT.address, "10000000000000000000000");
    await _LoANFT.mint(caps[0]);
    console.log(22);

    await _LoANFT.mint(caps[1]);
    console.log(23);
    
    const nfts = await _LoANFTData.getUserNFTs(treasury);
    console.log(nfts);
   
    await _loa.approve(_NFTMarket.address, "10000000000000000000000");

    await _NFTMarket.list(_LoANFT.address, nfts[0], "200000000000000000000000");
    console.log(24);
    await _NFTMarket.list(_LoANFT.address, nfts[0], "200000000000000000000000");
    console.log(25);

//     await _NFTMarket.unlist(_LoANFT.address, nfts[0], "200000000000000000000000");
//     console.log(26);
//     await _NFTMarket.unlist(_LoANFT.address, nfts[0], "200000000000000000000000");
//     console.log(27);
}

main();