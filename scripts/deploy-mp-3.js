const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");




   //const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
   //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN
   const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
   const admin2 = "0x36Ee9c4520F9E7C15A0Cba1e032627eDc2B4C50D";
   const admin3 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

   const multiSigAdmin_addr = '0x590CD0257F0D69dEb54E49122Fcef746d8a2720e';
   const raffleHelper_addr = '0xBD6fd8638cd89862f9562cEdA9E26ff4Ea55588D';
   const raffle_addr = '0x575f8fD5425E8AC90fDaB0aDDdbB69fe8588cDF1';
   const capsule_addr = "0x95acb7F921e9fA8aF5e617e07A9Dd5b9656c8F94";
   const capsuleData_addr = "0x1323583789EF04Dbabd4c0175A15F96c8015956b";
   const capsuleStaking_addr = "0x5D005826c5b5C9144cFF11770c38Fcb24338Cb89";
   const _LoANFTData_addr = "0xaBf7db6e1A5d968882403F80eF30060E57c51b62";
   const _LoANFT_addr = "0xA209301bEc49D77a966f986fD434eae4Ea9A457A";
   const _LoANFTFusion_addr = '0xC8D346D0F7f2Fb56d7e6a8757Dc944353fEA1Ab6';
   const _NFTMarket_addr = "0x9D800580d52D78c1aF2191C1A7305Ed22619a8C6";


   //ROPSTEN
//    const multiSigAdmin_addr = "0xd9B8A07A1A6b768ba0B294d248e4D693389cAb28";
//    const raffleHelper_addr = "0x44eA380498BA643E24d822511Da6a70Df47e01e4";
//    const raffle_addr = "0xe87D8910E007a8BAF3334fD6301dfC12f3D5DE09";
//    const capsule_addr = "0x4eda3F084e76e09CF1980018c1E89055453E1B36";
//    const capsuleData_addr = "0xA218cEAC4d24E0486C30635A635B7E93c9F179Ab";
//    const capsuleStaking_addr = "0xB2e0A5Fc0cc106Cc256b176b666619F90bf78ce9";
//    const _LoANFTData_addr = null;
//    const _LoANFT_addr = "0xEF6B385a4f3c35Dd95A768258bbC18C17D820b21";
//    const _LoANFTFusion_addr = "0x66a6a92005747a745F589f989052fd08F43f1145";
//    const _NFTMarket_addr = "0xfc5Aa7b168BAB32e86429704d883bF9C7b18111C";



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

   


   await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
   await multiSigAdmin.setMarketAddress(_NFTMarket.address);
   await multiSigAdmin.setCapsuleAddress(capsule.address);
   await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
   await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
   await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);
   await multiSigAdmin.setNFTAddress(_LoANFT.address);

   await multiSigAdmin.modifyRaffleAddress(raffle.address, true);

   await raffleHelper.putRafflePrices([500,1000, 1500, 2500],
       ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"], 
       [100, 200, 300, 400, 500], [500,1000, 1500, 2500]);


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


   
   await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
   await capsuleStaking.setCapsuleStakingRule(2, 0, "2000000000000000000000");
   await capsuleStaking.setCapsuleStakingRule(3, 0, "3000000000000000000000");
   await capsuleStaking.setCapsuleStakingRule(4, 0, "4000000000000000000000");
   await capsuleStaking.setCapsuleStakingRule(5, 0, "5000000000000000000000");
   console.log(6);


   await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);

   console.log(9);

   await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);


   console.log(13);

   await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["200000000000000000000", "100000000000000000000"], [50, 50]);
   console.log(14);
   
   
   
   await capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
   await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
   await capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
   await capsuleData.addCapsuleSupply(4, [8], [3080]);
   await capsuleData.addCapsuleSupply(5, [9], [100]);
   
   console.log(15.1);



   await _LoANFTData.addNFTSupply(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]);
   await _LoANFTData.addNFTSupply(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925]);
   await _LoANFTData.addNFTSupply(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1471, 1470, 1470, 1470, 1470, 1471, 1469, 1470, 1470, 1470]);
   await _LoANFTData.addNFTSupply(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [754, 755, 755, 755, 755, 754, 755, 755, 755, 755]);
   await _LoANFTData.addNFTSupply(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [435, 435, 435, 435, 435, 435, 436, 435, 435, 435]);
   await _LoANFTData.addNFTSupply(8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [400, 400, 400, 400, 400, 400, 400, 400, 400, 400]);
   await _LoANFTData.addNFTSupply(9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);


//    console.log(16);

   await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1464800, 1527700, 150400, 81900, 42100, 253300, 36500, 134000, 213700, 113200], [1302000, 1475000, 140800, 79800, 41000, 241900, 35300, 128000, 204200, 108200], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1681800, 1598000, 163200, 84700, 43600, 268400, 38200, 142000, 226500, 120000], [1573300, 1562800, 156800, 83300, 42800, 260800, 37400, 138000, 220100, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1844500, 1650600, 172800, 86800, 44600, 279700, 39500, 148000, 236100, 125100], [1736000, 1615500, 166400, 85400, 43900, 272200, 38600, 144000, 229700, 121700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2170000, 1756000, 192000, 91000, 46800, 302400, 42000, 160000, 255200, 135200], [2007300, 1703300, 182400, 88900, 45700, 291100, 40700, 154000, 245600, 130100], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2604000, 1896500, 217600, 96600, 49700, 332600, 45400, 176000, 280700, 148700], [2332800, 1808700, 201600, 93100, 47900, 313700, 43300, 166000, 264800, 140300], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3255000, 2107200, 256000, 105000, 54000, 378000, 50400, 200000, 319000, 169000], [2712500, 1931600, 224000, 98000, 50400, 340200, 46200, 180000, 287100, 152100], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1364900, 1583400, 13200, 74900, 47800, 164700, 7600, 108000, 164700, 87500], [1251100, 1545700, 6600, 73400, 46900, 158600, 7300, 104000, 158600, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1592400, 1658800, 26400, 77800, 49700, 176900, 8100, 116000, 176900, 94000], [1478600, 1621100, 19800, 76300, 48800, 170800, 7800, 112000, 170800, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1819800, 1734200, 39600, 80600, 51500, 189100, 8700, 124000, 189100, 100400], [1706100, 1696500, 33000, 79200, 50600, 183000, 8400, 120000, 183000, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2104200, 1828500, 56100, 84200, 53800, 204400, 9400, 134000, 204400, 108500], [1933600, 1771900, 46200, 82100, 52400, 195200, 9000, 128000, 195200, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2331700, 1903900, 69300, 87100, 55700, 216600, 9900, 142000, 216600, 115000], [2217900, 1866200, 62700, 85700, 54700, 210500, 9700, 138000, 210500, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2502300, 1960400, 79200, 89300, 57000, 225700, 10400, 148000, 225700, 119900], [2388500, 1922700, 72600, 87800, 56100, 219600, 10100, 144000, 219600, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2843500, 2073500, 99000, 93600, 59800, 244000, 11200, 160000, 244000, 129600], [2672900, 2017000, 89100, 91400, 58400, 234900, 10800, 154000, 234900, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3298500, 2224300, 125400, 99400, 63500, 268400, 12300, 176000, 268400, 142600], [3014100, 2130100, 108900, 95800, 61200, 253200, 11600, 166000, 253200, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3980900, 2450500, 165000, 108000, 69000, 305000, 14000, 200000, 305000, 162000], [3412200, 2262000, 132000, 100800, 64400, 274500, 12600, 180000, 274500, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 4);
   
   await _LoANFTData.addNFTAttributeLimits(1, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(2, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(3, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
   await _LoANFTData.addNFTAttributeLimits(4, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(5, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(6, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(7, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 2);
   await _LoANFTData.addNFTAttributeLimits(8, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 3);
   await _LoANFTData.addNFTAttributeLimits(9, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 4);

   console.log(16.1);
}

main();