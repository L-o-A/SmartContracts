const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");



//    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
   //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN
   const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
   const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
   const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

   const multiSigAdmin_addr = "0x461e6cf049116DbD886c59B02C414fbB8B329303";
   const raffleHelper_addr = "0x80E98c981d8dE9386a8A8A3728D41f291fc7983a";
   const raffle_addr = "0x6B17129189F1db06a6F5564c8CB5014964070C1F";
   const capsule_addr = "0xCC04F782bC18794a2747852E223Bfad317A6521d";
   const capsuleData_addr = "0xF9B1A745980C532Fc6b42FF3B8352e1FF29C62bE";
   const capsuleStaking_addr = "0x1f8Cc9a68993DD0225407E7E673498bd90545b35";
   const _LoANFTData_addr = null;
   const _LoANFT_addr = "0x057c9aCfe20f9DBD43f7c129474E030A57AAB510";
   const _LoANFTFusion_addr = "0x042369010a50612cb330Ee10570C15d1fEd6ECb0";
   const _NFTMarket_addr = "0xE8c334e9652f4E4cd29aECa13ccE30ef3454F5C9";





   loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");


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
       raffle = await Raffle.deploy(loa.address, raffleHelper.address, multiSigAdmin.address);
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
       capsuleStaking = await CapsuleStaking.deploy(loa.address, multiSigAdmin.address);
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
       _LoANFT = await LoANFT.deploy(loa.address, multiSigAdmin.address, _LoANFTData.address);
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
       _LoANFTFusion = await LoANFTFusion.deploy(loa.address, _LoANFT.address, multiSigAdmin.address);
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
       _NFTMarket = await NFTMarket.deploy(loa.address, multiSigAdmin.address);
       await _NFTMarket.deployed()
       console.log("_NFTMarket.address :", _NFTMarket.address);
   } else {
       const NFTMarket = await ethers.getContractFactory("NFTMarket");
       _NFTMarket = await NFTMarket.attach(_NFTMarket_addr);
       console.log("_NFTMarket.address :", _NFTMarket.address);
   }

   console.log(1);

   


//    await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
//    await multiSigAdmin.setMarketAddress(_NFTMarket.address);
//    await multiSigAdmin.setCapsuleAddress(capsule.address);
//    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
//    await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
   await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);
   await multiSigAdmin.setNFTAddress(_LoANFT.address);

//    await multiSigAdmin.modifyRaffleAddress(raffle.address, true);

//    await raffleHelper.putRafflePrices([500,1000, 1500, 2500],
//        ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"], 
//        [100, 200, 300, 400, 500], [500,1000, 1500, 2500]);


//    await raffleHelper.setRaffle(raffle.address);
//    console.log(2);

//    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
//    const tomorrow = parseInt(new Date().getTime()/1000 + 2* 86400  + "");
//    const future = parseInt(new Date().getTime()/1000 + 20* 86400  + "");

//    const raffleStatus = await raffle._raffle_status();
//    if(raffleStatus == 0){
//        await raffle.setRaffleInfo(1, twoDaysAgo + "", tomorrow + "", future + "");
//    }
//    console.log(3);


   
//    await capsuleStaking.setCapsuleStakingRule(1, 0, "500000000000000000000");
//    await capsuleStaking.setCapsuleStakingRule(2, 0, "500000000000000000000");
//    await capsuleStaking.setCapsuleStakingRule(3, 0, "3000000000000000000000");
//    await capsuleStaking.setCapsuleStakingRule(4, 0, "10000000000000000000000");
//    await capsuleStaking.setCapsuleStakingRule(5, 0, "100000000000000000000000");
//    console.log(6);


   await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);

   console.log(9);

   await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);


   console.log(13);

//    await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["200000000000000000000", "100000000000000000000"], [50, 50]);
//    console.log(14);
   
   
   
//    await capsuleData.addCapsuleSupply(1, [1, 2, 3], [50000, 25500, 14500]);
//    await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
   
//    console.log(15.1);



   await _LoANFTData.addNFTSupply(1, [1, 2, 3], [100, 100, 100]);
   await _LoANFTData.addNFTSupply(2, [1, 2, 3], [200, 200, 200]);
   await _LoANFTData.addNFTSupply(3, [1, 2, 3], [50, 50, 50]);


// //    console.log(16);

   await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(1, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(1, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [50000], [10000], 1);

   console.log(16.1);
}

main();