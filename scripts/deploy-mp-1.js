const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
   //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN
    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
    const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    // const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    // const multiSigAdmin = await MultiSigAdmin.deploy();
    // await multiSigAdmin.deployed();
    // console.log("multiSigAdmin.address :", multiSigAdmin.address);

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x2cB56ca188e99986E6D709433a96C957c01Edd71");
    console.log("multiSigAdmin.address :", multiSigAdmin.address);

    await multiSigAdmin.modifyAdmin(admin2, true);
    await multiSigAdmin.modifyAdmin(admin3, true);

    // await multiSigAdmin.initialize();
    console.log(-2);
    await multiSigAdmin.modifyAdmin(treasury, true);
    console.log(-1);
    await multiSigAdmin.setTreasury(treasury);
    console.log(0);

    // const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    // const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    // await raffleHelper.deployed();
    // console.log("raffleHelper.address :", raffleHelper.address);

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.attach("0x018aDF19F4220cB34AB9A0E6Fa5027a240923a9f");
    console.log("raffleHelper.address :", raffleHelper.address);


    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.deploy(loa, raffleHelper.address);
    // await raffle.deployed();
    // console.log("raffle.address :", raffle.address);

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach("0xE2dF354cF0D4524366BDc5240d79E9FA8C96A452");
    console.log("raffle.address :", raffle.address);

    // const Capsule = await ethers.getContractFactory("Capsule");
    // const capsule = await Capsule.deploy(multiSigAdmin.address);
    // await capsule.deployed()
    // console.log("capsule.address :", capsule.address);

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.attach("0xE2875B017F932755c7aa574b979467A7EA995269");
    console.log("capsule.address :", capsule.address);


    // const CapsuleData = await ethers.getContractFactory("CapsuleData");
    // const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    // await capsuleData.deployed()
    // console.log("capsuleData.address :", capsuleData.address);

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const capsuleData = await CapsuleData.attach("0xDccD858a020f1e98f89cFe88190f0ea98e5cE20B");
    console.log("capsuleData.address :", capsuleData.address);

    // const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    // const capsuleStaking = await CapsuleStaking.deploy(loa, multiSigAdmin.address);
    // await capsuleStaking.deployed()
    // console.log("capsuleStaking.address :", capsuleStaking.address);

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.attach("0xfEaB83d679ADb3cB212f77973A719d690e33960e");
    console.log("capsuleStaking.address :", capsuleStaking.address);


    // const LoANFT = await ethers.getContractFactory("LoANFT");
    // const _LoANFT = await LoANFT.deploy(loa, multiSigAdmin.address);
    // await _LoANFT.deployed()
    // console.log("_LoANFT.address :", _LoANFT.address);

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach("0x6257a3b49977df3F936E935FC3755ab14bB0Ce76");
    console.log("_LoANFT.address :", _LoANFT.address);
    
    // const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    // const _LoANFTAttributes = await LoANFTAttributes.deploy(multiSigAdmin.address);
    // await _LoANFTAttributes.deployed()
    // console.log("_LoANFTAttributes.address :", _LoANFTAttributes.address);

    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.attach("0xe3403c2B12E5f7585b2Adc4D362859bB764E064F");
    console.log("_LoANFTAttributes.address :", _LoANFTAttributes.address);
    
    // const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
    // const _LoANFTFusion = await LoANFTFusion.deploy(loa, _LoANFT.address, multiSigAdmin.address);
    // await _LoANFTFusion.deployed()
    // console.log("_LoANFTFusion.address :", _LoANFTFusion.address);

    const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
    const _LoANFTFusion = await LoANFTFusion.attach("0x3B9403397bEEfFd99Fc8c49ae22649Be574Dd9Ae");
    console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    
    
    // const NFTMarket = await ethers.getContractFactory("NFTMarket");
    // const _NFTMarket = await NFTMarket.deploy(loa, multiSigAdmin.address);
    // await _NFTMarket.deployed()
    // console.log("_NFTMarket.address :", _NFTMarket.address);

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.attach("0xAc2ade0186B144882E11C8e4Ed591e3bd8350535");
    console.log("_NFTMarket.address :", _NFTMarket.address);
    
    console.log(1);


    await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
    await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    await multiSigAdmin.setNFTAddress(_LoANFT.address);
    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
    await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

   //  await multiSigAdmin.updateContractAddresses([capsule.address ,capsuleStaking.address, raffle.address, _NFTMarket.address, _LoANFTFusion.address, _LoANFT.address])
    
    // const AxionSphere = await ethers.getContractFactory("AxionSphere");
    // const _AxionSphere = await AxionSphere.deploy(multiSigAdmin.address);
    // await _AxionSphere.deployed()
    // console.log("_AxionSphere.address :", _AxionSphere.address);

    /**
     *  function putRafflePrices(
        uint256[] memory supply,
        uint256[] memory prices,
        uint64[] memory reward_amount,
        uint256[] memory reward_range
        
    )
     */
    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);


    await raffleHelper.setRaffle(raffle.address);
    console.log(2);

    /**
     * function setRaffleData(
        uint8 category,
        uint256 startTime,
        uint256 endTime,
        address capsuleAddress,
        address treasury
    )
     */
    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 + 2* 86400  + "");
    
    await raffle.setRaffleData(1, twoDaysAgo + "", oneDayAgo + "", capsule.address, treasury);
  
    console.log(3);

    console.log(4);


    /**
     * function modifyCapsules(
        bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory types
    )
     */
    await capsuleData.modifyCapsules(true, [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    console.log(5);
    
    /**
     * function setCapsuleStakingRule(uint8 capsuleType, uint32 stakingDays, uint256 loaTokens)
     */
    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    console.log(6);

    /**
     * function modifyCapsules(
        bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory types
    )
     */
    await capsuleStaking.setAddresses(capsule.address);
    console.log(7);

    /**
     * function updateAccessAddressAndFees (
        address capsuleContract, 
        address nftMarketAddress,
        address fusion_address,
        address loaNFTAttributeAddress,
        uint8[] memory capsuleTypes,
        uint256[] memory fees)
     */
    await _LoANFT.updateFees([1, 2, 3], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000"]);
    console.log(8);

    /**
     *  function modifyNFTs(bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory heroes,
        uint256[] memory startTimes
    )
     */
    await _LoANFT.modifyNFTs(true, [1,2,3,4,5,6,7,8,9,10], [1,1,1,1,1,1,1,1,1,1], [1,2,1,2,1,2,1,2,1,2],[1,1,1,1,1,1,1,1,1,1]);
    console.log(9);

    await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    console.log(10);
    await _LoANFTAttributes.putNFTAttributeNames("HERO,HASH-POWER,MAX-HP,MAX-PRANA,MAXSPEED,HP-REGEN,PRANA-REGEN,ATTACK-DAMAGE,ATTACK-SPEED,CRITICAL-DAMAGE,ARMOUR,MAGIC-DEFENCE");

    console.log(11);

    /**
     * function putNFTAttributes (uint256[] memory ids, string[] memory attribs)
     */
     await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5], 
      [
          "1-3-4-1-0-0-0-0-6-7-8", 
          "2-4-0-0-0-0-4-5-6-7-8", 
          "3-5-6-3-0-0-0-0-7-8-2", 
          "4-6-7-4-2-3-0-0-0-0-3", 
          "5-7-8-5-2-3-4-0-0-0-0", 
      ]);

    await _LoANFTAttributes.putNFTAttributes([6, 7, 8, 9, 10], 
         [
             "1-3-0-0-0-0-4-5-6-7-8", 
             "2-4-5-0-0-0-0-5-6-7-8", 
             "3-5-6-3-2-0-0-0-0-8-1", 
             "4-6-7-4-0-0-0-0-7-8-1", 
             "5-7-8-5-2-3-0-0-0-0-2", 
         ]);
   //   console.log(12);


    /**
     * function createFusionRule(
        uint256 id,
        uint256 price,
        uint8 resultLevel,
        uint8[] memory levelValues
    )
     */
    await _LoANFTFusion.createFusionRule(1, "1000000000000000000000", 2, [1,1]);
    console.log(13);

    /**
     * function updateFees (
        address[] memory contractAddresses, 
        uint256[] memory fees)
     */
    await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["200000000000000000000", "100000000000000000000"], [50, 50]);
    console.log(14);
    
    await multiSigAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(15);

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

    await raffle.setRaffleData(1, 10, 100000, capsule.address, treasury);
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
    
    const nfts = await _LoANFT.getUserNFTs(treasury);
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