// const { expect } = require("chai");
// const { ethers } = require("hardhat");



// describe("RAFFLE ", function () {



//   it("RAFFLE Test -5", async function () {

//     const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
//     const LOA = await ethers.getContractFactory("MYERC20");
//     const loa = await LOA.deploy("LOA", "LOA");
//     await loa.deployed();
    
//     // expect(await loa.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
//     expect(await loa.balanceOf(addr1.address)).to.equal(0);

//     const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
//     const multiSigAdmin = await MultiSigAdmin.deploy();
//     await multiSigAdmin.deployed();

//     await multiSigAdmin.setTreasury(owner.address);

//     const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
//     const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
//     await raffleHelper.deployed();

//     const Raffle = await ethers.getContractFactory("Raffle");
//     const raffle = await Raffle.deploy(loa.address, raffleHelper.address, multiSigAdmin.address);
//     await raffle.deployed();


    

//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy(multiSigAdmin.address);
//     await capsule.deployed();

//     const CapsuleData = await ethers.getContractFactory("CapsuleData");
//     const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
//     await capsuleData.deployed();

//     await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
//     await multiSigAdmin.setCapsuleAddress(capsule.address);
//     await multiSigAdmin.modifyRaffleAddress(raffle.address, true);


    

//     // await raffle.setContractAddresses(capsule.address, raffleHelper.address);

//     await raffle.setRaffleInfo(1, 10, 1999999999999, 2999999999999);
//     // await raffleHelper.putRafflePrices([10, 20], [100, 110, 115],  [2, 4, 20], [5, 7]);

//     // console.log('_raffle_price_range(0) :', await raffle._raffle_price_range(0));
//     // console.log('_raffle_price_range(1) :',await raffle._raffle_price_range(1));
//     // expect(await raffle._raffle_price_range(0)).to.equal(100);
//     // expect(await raffle._raffle_price_range(1)).to.equal(110);
    
//     // await raffleHelper.putRafflePrices([10, 20, 30], [10, 20, 30, 40], [2, 4, 20], [5, 7]);
//     await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

    
//     await capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
//     await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
//     await capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
//     await capsuleData.addCapsuleSupply(4, [8], [3080]);
//     await capsuleData.addCapsuleSupply(5, [9], [100]);

    
    
//     // console.log('_raffle_price_range(0) :', await raffle._raffle_price_range(0));
//     // console.log('_raffle_price_range(1) :',await raffle._raffle_price_range(1));
//     // console.log('_raffle_price_range(2) :',await raffle._raffle_price_range(2));
//     // console.log('_raffle_price_range(3) :',await raffle._raffle_price_range(3));

//     // expect(await raffle._raffle_price_range(0)).to.equal(10);
//     // expect(await raffle._raffle_price_range(1)).to.equal(11);

//     // uint8 category,
//     //     uint256 startTime,
//     //     uint256 endTime,
//     //     uint256[] memory reward_range,
//     //     uint256[] memory reward_amount,
//     //     uint256[] memory supply,
//     //     uint256[] memory prices

//     // await raffle.setRaffleInfo(3, 3, 10, 10, 1999999999999, [5, 7], [2, 4, 20], [10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15]);
//     // await raffle.setRaffleInfo(2, 200, 2, 3, 10, 1999999999999, 1999999999999);
    
//     expect(await raffle._raffle_status()).to.equal(1);
    
//     await loa.connect(owner).transfer(addr1.address, "200000000000000000000000");
//     await loa.connect(owner).transfer(addr2.address, "200000000000000000000000");
//     await loa.connect(owner).transfer(addr3.address, "200000000000000000000000");
//     await loa.connect(addr1).approve(raffle.address, "20000000000000000000000");

    
//     await raffle.connect(addr1).buyTicket(10);
   
    
    

//     // expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
//     // expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
//     // expect(await raffle._ticket_owner(3)).to.equal(addr1.address);

//     //_raffleContract.balanceOf(owner, ticketId)
    


//     await raffle.setRaffleInfo(1, 10, 100, 102);
//     // await raffleHelper.putRafflePrices([10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15], [5, 7], [2, 4, 20]);
    
//     console.log("getUserTickets :", await raffle.getUserTickets(addr1.address));

    
//     await raffle.pickWinner(20);

//     console.log("getUserWinningTickets:", await raffle.connect(addr1).getUserWinningTickets(addr1.address));
//     await raffle.connect(addr1).withdraw(loa.address);
//     await raffle.connect(addr1).withdraw(loa.address);

    
//     const tickets = await raffle.getUserTickets(addr1.address)
//     console.log("getUserTickets :", tickets);

//     await capsule.connect(addr1).claim(tickets, raffle.address, addr1.address);

//     console.log(await capsuleData.getUserCapsules(addr1.address));

    
    
//     let balance = await raffle._raffle_winner_count();
//     console.log('winner_count :', balance);
//     balance = await loa.balanceOf(addr1.address);
    

//     // expect(await raffle._refund_address_to_amount(addr1.address)).to.equal(20);
//     // expect(await loa.balanceOf(addr1.address)).to.equal(1960);

//     console.log("balance :", balance);

//     // console.log(await raffle._user_tickets(addr1.address, 0));
//     // console.log(await raffle._user_tickets(addr1.address, 1));

    
//     await raffle.connect(addr1).withdraw(loa.address);
//     await raffle.connect(addr1).withdraw(loa.address);


//     const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
//     const capsuleStaking = await CapsuleStaking.deploy(loa.address, multiSigAdmin.address);
//     await capsuleStaking.deployed();

//     await capsuleStaking.setCapsuleStakingRule(1, 0, 1000);

//     await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);

//     console.log(await capsuleData.getUserCapsules(addr1.address));

//     await capsule.connect(addr1).setApprovalForAll(capsuleStaking.address, true);

//     await loa.connect(addr1).approve(capsuleStaking.address, 10000);

//     const userCapsules = await capsuleData.getUserCapsules(addr1.address);
    
//     console.log("user Capsules -0", await capsuleData.getUserCapsules(addr1.address));
//     // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
//     await capsuleStaking.connect(addr1).stake([1,2,3,4,5]);
    
//     // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    
//     console.log("User capsules after staking:", await capsule.balanceOf(addr1.address, 1));
//     console.log("user Capsules -1", await capsuleData.getUserCapsules(addr1.address));
//     console.log("fetchStakedCapsules -1", await capsuleStaking.fetchStakedCapsules(addr1.address));
    
//     await capsuleStaking.connect(addr1).reclaim([1,2,3], false);
//     console.log("fetchStakedCapsules -2", await capsuleStaking.fetchStakedCapsules(addr1.address));
//     await capsuleStaking.connect(addr1).reclaim([4,5], false);
//     console.log("fetchStakedCapsules -3", await capsuleStaking.fetchStakedCapsules(addr1.address));
    
//     await loa.connect(addr1).approve(capsuleStaking.address, 10000);
//     await capsuleStaking.connect(addr1).stake([6,7,8,9,10]);

//     await capsuleStaking.connect(addr1).reclaim([6,7,8,9,10], false);

//     console.log("reclaimed");
//     // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
//     console.log("User capsules after reclaim:", await capsule.balanceOf(addr1.address, 2));

//     const LoANFTData = await ethers.getContractFactory("LoANFTData");
//     const _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
//     await _LoANFTData.deployed();

//     const LoANFT = await ethers.getContractFactory("LoANFT");
//     const _LoANFT = await LoANFT.deploy(loa.address, multiSigAdmin.address, _LoANFTData.address);
//     await _LoANFT.deployed();


//     await multiSigAdmin.setNFTAddress(_LoANFT.address);

//     await _LoANFTData.updateFees([1,2,3], [1000,2000, 3000]);

//     await _LoANFTData.addNFTSupply(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075]);
//     await _LoANFTData.addNFTSupply(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]);
//     await _LoANFTData.addNFTSupply(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925]);
//     await _LoANFTData.addNFTSupply(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1471, 1470, 1470, 1470, 1470, 1471, 1469, 1470, 1470, 1470]);
//     await _LoANFTData.addNFTSupply(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [754, 755, 755, 755, 755, 754, 755, 755, 755, 755]);
//     await _LoANFTData.addNFTSupply(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [435, 435, 435, 435, 435, 435, 436, 435, 435, 435]);
//     await _LoANFTData.addNFTSupply(8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [400, 400, 400, 400, 400, 400, 400, 400, 400, 400]);
//     await _LoANFTData.addNFTSupply(9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);

//     await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);

    

//     console.log(12);

//     await loa.connect(addr1).approve(_LoANFT.address, "20000000000000000000");

//     let capsules = await capsuleData.getUserCapsules(addr1.address);
    
//     console.log("capsules count :", capsules.length);
    
//     console.log("ready to mint nft");
//     await _LoANFT.connect(addr1).mint([capsules[0], capsules[1]]);
//     console.log("nft minted");
    
//     capsules = await capsuleData.getUserCapsules(addr1.address);
//     console.log("capsules count - 2:", capsules.length);

//     return;

//     console.log("getUserNFTs :", await _LoANFTData.getUserNFTs(addr1.address));

    
//     const NFTMarket = await ethers.getContractFactory("NFTMarket");
//     const _NFTMarket = await NFTMarket.deploy(loa.address, multiSigAdmin.address);
//     await _NFTMarket.deployed();

//     await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    
//     await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["20000000000000000000", "10000000000000000000"], [50, 40]);
    
//     await _LoANFT.connect(addr1).setApprovalForAll(_NFTMarket.address, true);
//     await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");

//     const myNfts = await _LoANFTData.getUserNFTs(addr1.address);
//     console.log("myNfts :", myNfts);


//     await _NFTMarket.connect(addr1).list(_LoANFT.address, myNfts[0], "2000000000000000000000");
//     console.log("\n\n before unlist", await _NFTMarket.fetchMarketItems());
//     await _NFTMarket.connect(addr1).unlist(1);
//     await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");

    
//     await _NFTMarket.connect(addr1).list(_LoANFT.address, myNfts[0], "2000000000000000000000");
    
//     await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
//     await _NFTMarket.connect(addr1).list(_LoANFT.address, myNfts[1], "2000000000000000000000");
    
//     console.log("\n\n", await _NFTMarket.fetchMarketItems());
//     await loa.connect(addr2).approve(_NFTMarket.address, "2000000000000000000000");
//     await _NFTMarket.connect(addr2).buy(2);
//     console.log("\n\n", await _NFTMarket.fetchMarketItems());
    
//     console.log("\n\n", await _NFTMarket.getMarketItem(2));


//     await loa.connect(addr2).approve(_NFTMarket.address, "20000000000000000000");
//     await _LoANFT.connect(addr2).setApprovalForAll(_NFTMarket.address, true);
//     await _NFTMarket.connect(addr2).list(_LoANFT.address, myNfts[0], "2000000000000000000000");


//     console.log("\n\n", await _NFTMarket.fetchMarketItems());
//     await _NFTMarket.connect(addr2).updatePrice(4, "4000000000000000000000");


//     await loa.connect(addr3).approve(_NFTMarket.address, "2000000000000000000000");
//     await _NFTMarket.connect(addr3).buy(3);

//     await raffle.terminate();

//     console.log("putNFTAttributeNames");

//     await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);

//     console.log("addNFTAttributeLimits");


//     await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1464800, 1527700, 150400, 81900, 42100, 253300, 36500, 134000, 213700, 113200], [1302000, 1475000, 140800, 79800, 41000, 241900, 35300, 128000, 204200, 108200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1681800, 1598000, 163200, 84700, 43600, 268400, 38200, 142000, 226500, 120000], [1573300, 1562800, 156800, 83300, 42800, 260800, 37400, 138000, 220100, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1844500, 1650600, 172800, 86800, 44600, 279700, 39500, 148000, 236100, 125100], [1736000, 1615500, 166400, 85400, 43900, 272200, 38600, 144000, 229700, 121700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2170000, 1756000, 192000, 91000, 46800, 302400, 42000, 160000, 255200, 135200], [2007300, 1703300, 182400, 88900, 45700, 291100, 40700, 154000, 245600, 130100], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2604000, 1896500, 217600, 96600, 49700, 332600, 45400, 176000, 280700, 148700], [2332800, 1808700, 201600, 93100, 47900, 313700, 43300, 166000, 264800, 140300], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3255000, 2107200, 256000, 105000, 54000, 378000, 50400, 200000, 319000, 169000], [2712500, 1931600, 224000, 98000, 50400, 340200, 46200, 180000, 287100, 152100], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1364900, 1583400, 13200, 74900, 47800, 164700, 7600, 108000, 164700, 87500], [1251100, 1545700, 6600, 73400, 46900, 158600, 7300, 104000, 158600, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1592400, 1658800, 26400, 77800, 49700, 176900, 8100, 116000, 176900, 94000], [1478600, 1621100, 19800, 76300, 48800, 170800, 7800, 112000, 170800, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1819800, 1734200, 39600, 80600, 51500, 189100, 8700, 124000, 189100, 100400], [1706100, 1696500, 33000, 79200, 50600, 183000, 8400, 120000, 183000, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2104200, 1828500, 56100, 84200, 53800, 204400, 9400, 134000, 204400, 108500], [1933600, 1771900, 46200, 82100, 52400, 195200, 9000, 128000, 195200, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2331700, 1903900, 69300, 87100, 55700, 216600, 9900, 142000, 216600, 115000], [2217900, 1866200, 62700, 85700, 54700, 210500, 9700, 138000, 210500, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2502300, 1960400, 79200, 89300, 57000, 225700, 10400, 148000, 225700, 119900], [2388500, 1922700, 72600, 87800, 56100, 219600, 10100, 144000, 219600, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2843500, 2073500, 99000, 93600, 59800, 244000, 11200, 160000, 244000, 129600], [2672900, 2017000, 89100, 91400, 58400, 234900, 10800, 154000, 234900, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3298500, 2224300, 125400, 99400, 63500, 268400, 12300, 176000, 268400, 142600], [3014100, 2130100, 108900, 95800, 61200, 253200, 11600, 166000, 253200, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3980900, 2450500, 165000, 108000, 69000, 305000, 14000, 200000, 305000, 162000], [3412200, 2262000, 132000, 100800, 64400, 274500, 12600, 180000, 274500, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(1, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(2, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(3, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(4, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(5, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(6, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(7, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(8, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [50000], [10000], 1);
//     await _LoANFTData.addNFTAttributeLimits(9, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [50000], [10000], 1);


    
//     console.log("added NFTAttributeLimits");
//     // await _LoANFTData.populateAttribute(101, 1, 1);
//     // console.log("_LoANFTData.populateAttribute(101, 1, 1)");
//     // await _LoANFTData.populateAttribute(102, 1, 1);
//     // console.log("_LoANFTData.populateAttribute(102, 1, 1)");
//     // await _LoANFTData.populateAttribute(103, 1, 1);
//     // console.log("_LoANFTData.populateAttribute(103, 1, 1)");

//   });


// });


