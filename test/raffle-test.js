const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("RAFFLE ", function () {



  it("RAFFLE Test -5", async function () {

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    const LOA = await ethers.getContractFactory("MYERC20");
    const loa = await LOA.deploy("LOA", "LOA");
    await loa.deployed();
    
    // expect(await loa.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
    expect(await loa.balanceOf(addr1.address)).to.equal(0);

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.deploy();
    await multiSigAdmin.deployed();

    await multiSigAdmin.setTreasury(owner.address);

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    await raffleHelper.deployed();

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa.address, raffleHelper.address, multiSigAdmin.address);
    await raffle.deployed();


    

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(multiSigAdmin.address);
    await capsule.deployed();

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
    await capsuleData.deployed();

    await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.modifyRaffleAddress(raffle.address, true);


    

    // await raffle.setContractAddresses(capsule.address, raffleHelper.address);

    await raffle.setRaffleInfo(1, 10, 1999999999999, 2999999999999);
    // await raffleHelper.putRafflePrices([10, 20], [100, 110, 115],  [2, 4, 20], [5, 7]);

    // console.log('_raffle_price_range(0) :', await raffle._raffle_price_range(0));
    // console.log('_raffle_price_range(1) :',await raffle._raffle_price_range(1));
    // expect(await raffle._raffle_price_range(0)).to.equal(100);
    // expect(await raffle._raffle_price_range(1)).to.equal(110);
    
    // await raffleHelper.putRafflePrices([10, 20, 30], [10, 20, 30, 40], [2, 4, 20], [5, 7]);
    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

    
    await capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
    await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
    await capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
    await capsuleData.addCapsuleSupply(4, [8], [3080]);
    await capsuleData.addCapsuleSupply(5, [9], [100]);

    
    
    // console.log('_raffle_price_range(0) :', await raffle._raffle_price_range(0));
    // console.log('_raffle_price_range(1) :',await raffle._raffle_price_range(1));
    // console.log('_raffle_price_range(2) :',await raffle._raffle_price_range(2));
    // console.log('_raffle_price_range(3) :',await raffle._raffle_price_range(3));

    // expect(await raffle._raffle_price_range(0)).to.equal(10);
    // expect(await raffle._raffle_price_range(1)).to.equal(11);

    // uint8 category,
    //     uint256 startTime,
    //     uint256 endTime,
    //     uint256[] memory reward_range,
    //     uint256[] memory reward_amount,
    //     uint256[] memory supply,
    //     uint256[] memory prices

    // await raffle.setRaffleInfo(3, 3, 10, 10, 1999999999999, [5, 7], [2, 4, 20], [10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15]);
    // await raffle.setRaffleInfo(2, 200, 2, 3, 10, 1999999999999, 1999999999999);
    
    expect(await raffle._raffle_status()).to.equal(1);
    
    await loa.connect(owner).transfer(addr1.address, "200000000000000000000000");
    await loa.connect(owner).transfer(addr2.address, "200000000000000000000000");
    await loa.connect(owner).transfer(addr3.address, "200000000000000000000000");
    await loa.connect(addr1).approve(raffle.address, "20000000000000000000000");

    
    await raffle.connect(addr1).buyTicket(10);
   
    
    

    // expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(3)).to.equal(addr1.address);

    //_raffleContract.balanceOf(owner, ticketId)
    


    await raffle.setRaffleInfo(1, 10, 100, 102);
    // await raffleHelper.putRafflePrices([10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15], [5, 7], [2, 4, 20]);
    
    console.log("getUserTickets :", await raffle.getUserTickets(addr1.address));

    
    await raffle.pickWinner(20);

    console.log("getUserWinningTickets:", await raffle.connect(addr1).getUserWinningTickets(addr1.address));
    await raffle.connect(addr1).withdraw(loa.address);
    await raffle.connect(addr1).withdraw(loa.address);

    
    const tickets = await raffle.getUserTickets(addr1.address)
    console.log("getUserTickets :", tickets);

    await capsule.connect(addr1).claim(tickets, raffle.address, addr1.address);

    console.log(await capsuleData.getUserCapsules(addr1.address));

    
    try{
    //   await raffle.pickWinner(2);
    //   await raffle.pickWinner(2);
    //   await raffle.pickWinner(2);
    //   await raffle.pickWinner(2);
    //   await raffle.pickWinner(2);
    } catch(e){
        console.log(e);
    }
    
    let balance = await raffle._raffle_winner_count();
    console.log('winner_count :', balance);
    balance = await loa.balanceOf(addr1.address);
    

    // expect(await raffle._refund_address_to_amount(addr1.address)).to.equal(20);
    // expect(await loa.balanceOf(addr1.address)).to.equal(1960);

    console.log("balance :", balance);

    // console.log(await raffle._user_tickets(addr1.address, 0));
    // console.log(await raffle._user_tickets(addr1.address, 1));

    
    await raffle.connect(addr1).withdraw(loa.address);
    await raffle.connect(addr1).withdraw(loa.address);
    // expect(await loa.balanceOf(addr1.address)).to.equal("199999999999999980");
    // console.log(await capsule.balanceOf(addr1.address, 1));
    // console.log(await capsule.balanceOf(addr1.address, 2));
    // console.log(await capsule.balanceOf(addr1.address, 3));
    // console.log(await capsule.balanceOf(addr1.address, 4));
    // console.log(await capsule.balanceOf(addr1.address, 5));


    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.deploy(loa.address, multiSigAdmin.address);
    await capsuleStaking.deployed();

    await capsuleStaking.setCapsuleStakingRule(1, 0, 1000);

    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);

    console.log(await capsuleData.getUserCapsules(addr1.address));

    await capsule.connect(addr1).setApprovalForAll(capsuleStaking.address, true);

    await loa.connect(addr1).approve(capsuleStaking.address, 10000);

    const userCapsules = await capsuleData.getUserCapsules(addr1.address);
    
    console.log("user Capsules -0", await capsuleData.getUserCapsules(addr1.address));
    // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    await capsuleStaking.connect(addr1).stake([1,2,3,4,5]);
    
    // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    
    console.log("User capsules after staking:", await capsule.balanceOf(addr1.address, 1));
    console.log("user Capsules -1", await capsuleData.getUserCapsules(addr1.address));
    console.log("fetchStakedCapsules -1", await capsuleStaking.fetchStakedCapsules(addr1.address));
    
    await capsuleStaking.connect(addr1).reclaim([1,2,3], false);
    console.log("fetchStakedCapsules -2", await capsuleStaking.fetchStakedCapsules(addr1.address));
    await capsuleStaking.connect(addr1).reclaim([4,5], false);
    console.log("fetchStakedCapsules -3", await capsuleStaking.fetchStakedCapsules(addr1.address));
    
    await loa.connect(addr1).approve(capsuleStaking.address, 10000);
    await capsuleStaking.connect(addr1).stake([6,7,8,9,10]);

    await capsuleStaking.connect(addr1).reclaim([6,7,8,9,10], false);

    console.log("user Capsules - 2", await capsuleData.getUserCapsules(addr1.address));
    console.log("reclaimed");
    // console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    console.log("User capsules after reclaim:", await capsule.balanceOf(addr1.address, 2));

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
    await _LoANFTData.deployed();

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.deploy(loa.address, multiSigAdmin.address, _LoANFTData.address);
    await _LoANFT.deployed();


    await multiSigAdmin.setNFTAddress(_LoANFT.address);

    await _LoANFTData.updateFees([1,2,3], [1000,2000, 3000]);

    await _LoANFTData.addNFTSupply(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075]);
    await _LoANFTData.addNFTSupply(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]);
    await _LoANFTData.addNFTSupply(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925]);
    await _LoANFTData.addNFTSupply(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1471, 1470, 1470, 1470, 1470, 1471, 1469, 1470, 1470, 1470]);
    await _LoANFTData.addNFTSupply(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [754, 755, 755, 755, 755, 754, 755, 755, 755, 755]);
    await _LoANFTData.addNFTSupply(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [435, 435, 435, 435, 435, 435, 436, 435, 435, 435]);
    await _LoANFTData.addNFTSupply(8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [400, 400, 400, 400, 400, 400, 400, 400, 400, 400]);
    await _LoANFTData.addNFTSupply(9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);

    await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);

    // await _LoANFTData.addNFTAttributeLimits(1, 1, [2,3,4,5,6,7,8,9,10,11], [759500], [65100] [1], [] ,[], 1)

    // await _LoANFTData.putNFTAttributes([1,2,3,4,5,6,7,8,9,10], ["1-0-0", "1-2-0", "1-3-0", "1-4-0", "1-5-0", "2-0-1", "2-0-1", "2-0-1", "2-2-1", "2-0-2"]);
    console.log(12);

    await loa.connect(addr1).approve(_LoANFT.address, "20000000000000000000");

    console.log("ready to mint nft");
    await _LoANFT.connect(addr1).mint([1,2]);
    console.log("nft minted");


    console.log("getUserNFTs :", await _LoANFTData.getUserNFTs(addr1.address));

    
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.deploy(loa.address, multiSigAdmin.address);
    await _NFTMarket.deployed();

    await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    
    await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["20000000000000000000", "10000000000000000000"], [50, 40]);
    
    await _LoANFT.connect(addr1).setApprovalForAll(_NFTMarket.address, true);
    await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
    await _NFTMarket.connect(addr1).list(_LoANFT.address, 10, "2000000000000000000000");
    console.log("\n\n before unlist", await _NFTMarket.fetchMarketItems());
    await _NFTMarket.connect(addr1).unlist(1);
    await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
    await _NFTMarket.connect(addr1).list(_LoANFT.address, 10, "2000000000000000000000");
    
    await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
    await _NFTMarket.connect(addr1).list(_LoANFT.address, 9, "2000000000000000000000");
    
    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    await loa.connect(addr2).approve(_NFTMarket.address, "2000000000000000000000");
    await _NFTMarket.connect(addr2).buy(2);
    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    
    console.log("\n\n", await _NFTMarket.getMarketItem(2));


    await loa.connect(addr2).approve(_NFTMarket.address, "20000000000000000000");
    await _LoANFT.connect(addr2).setApprovalForAll(_NFTMarket.address, true);
    await _NFTMarket.connect(addr2).list(_LoANFT.address, 10, "2000000000000000000000");


    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    await _NFTMarket.connect(addr2).updatePrice(4, "4000000000000000000000");


    await loa.connect(addr3).approve(_NFTMarket.address, "2000000000000000000000");
    await _NFTMarket.connect(addr3).buy(3);

    await raffle.terminate();

  });


});


