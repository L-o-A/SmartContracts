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
    const raffle = await Raffle.deploy(loa.address, raffleHelper.address);
    await raffle.deployed();


    

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(multiSigAdmin.address);
    await capsule.deployed();

    await capsule.modifyCapsules(true, [1, 2, 4, 5],  [1,1,1,1], [1,1,1,1]);
    await multiSigAdmin.modifyRaffleAddress(raffle.address, true);

    

    // await raffle.setContractAddresses(capsule.address, raffleHelper.address);

    await raffle.setRaffleData(1, 10, 1999999999999, capsule.address,  owner.address);
    // await raffleHelper.putRafflePrices([10, 20], [100, 110, 115],  [2, 4, 20], [5, 7]);

    // console.log('_raffle_price_range(0) :', await raffle._raffle_price_range(0));
    // console.log('_raffle_price_range(1) :',await raffle._raffle_price_range(1));
    // expect(await raffle._raffle_price_range(0)).to.equal(100);
    // expect(await raffle._raffle_price_range(1)).to.equal(110);
    
    // await raffleHelper.putRafflePrices([10, 20, 30], [10, 20, 30, 40], [2, 4, 20], [5, 7]);
    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

    console.log(await raffleHelper.calcPrice(10, "10"));
    console.log(await raffleHelper.calcPrice(20, "10"));
    console.log(await raffleHelper.calcPrice(30, "10"));
    console.log(await raffleHelper.calcPrice(40, "10"));
    console.log(await raffleHelper.calcPrice(50, "10"));

    

    
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

    // await raffle.setRaffleData(3, 3, 10, 10, 1999999999999, [5, 7], [2, 4, 20], [10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15]);
    // await raffle.setRaffleData(2, 200, 2, 3, 10, 1999999999999);
    
    expect(await raffle._raffle_status()).to.equal(1);
    
    await loa.connect(owner).transfer(addr1.address, "200000000000000000000000");
    await loa.connect(owner).transfer(addr2.address, "200000000000000000000000");
    await loa.connect(owner).transfer(addr3.address, "200000000000000000000000");
    await loa.connect(addr1).approve(raffle.address, "20000000000000000000");

    
    await raffle.connect(addr1).buyTicket(2);
   
    
    
    // expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(3)).to.equal(addr1.address);

    console.log("raffle.balanceOf(addr1, 1) :", await raffle.balanceOf(addr1.address, 1));

    //_raffleContract.balanceOf(owner, ticketId)
    


    await raffle.setRaffleData(1, 10, 100, capsule.address,  owner.address);
    // await raffleHelper.putRafflePrices([10, 20, 30, 40, 50], [10, 11, 12, 13, 14, 15], [5, 7], [2, 4, 20]);
    
    console.log("getUserTickets :", await raffle.getUserTickets(addr1.address));

    
    await raffle.pickWinner(4);
    
    console.log("after pick winner raffle.balanceOf(addr1, 1) :", await raffle.balanceOf(addr1.address, 1));
    const tickets = await raffle.getUserTickets(addr1.address)
    console.log("getUserTickets :", tickets);

    await capsule.connect(addr1).claim(tickets, raffle.address, addr1.address);

    console.log(await capsule.getUserCapsules(addr1.address));

    
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
    // expect(await raffle.balanceOf(addr1.address, 1)).to.equal(0);
    // expect(await loa.balanceOf(addr1.address)).to.equal(1960);

    console.log("balance :", balance);

    // console.log(await raffle._user_tickets(addr1.address, 0));
    // console.log(await raffle._user_tickets(addr1.address, 1));

    
    await raffle.connect(addr1).withdraw(loa.address);
    // expect(await loa.balanceOf(addr1.address)).to.equal("199999999999999980");
    console.log(await capsule.balanceOf(addr1.address, 1));
    console.log(await capsule.balanceOf(addr1.address, 2));
    console.log(await capsule.balanceOf(addr1.address, 3));
    console.log(await capsule.balanceOf(addr1.address, 4));
    console.log(await capsule.balanceOf(addr1.address, 5));


    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStaking = await CapsuleStaking.deploy(loa.address, multiSigAdmin.address);
    await capsuleStaking.deployed();

    await capsuleStaking.setCapsuleStakingRule(1, 0, 1000);

    await capsuleStaking.setAddresses(capsule.address);

    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);

    console.log(await capsule.getUserCapsules(addr1.address));

    await capsule.connect(addr1).setApprovalForAll(capsuleStaking.address, true);

    await loa.connect(addr1).approve(capsuleStaking.address, 2000);

    console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    await capsuleStaking.connect(addr1).stake([5, 4]);
    
    console.log("_capsule_status[5] :", await capsule._capsule_status(5));

    console.log("User capsules after staking:", await capsule.balanceOf(addr1.address, 5));
    
    await capsuleStaking.connect(addr1).reclaim([5, 4], false);
    console.log("reclaimed");
    console.log("_capsule_status[5] :", await capsule._capsule_status(5));
    console.log("User capsules after reclaim:", await capsule.balanceOf(addr1.address, 5));


    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.deploy(loa.address, multiSigAdmin.address);
    await _LoANFT.deployed();

    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    

    await multiSigAdmin.setNFTAddress(_LoANFT.address);

    await _LoANFT.updateFees([1,2,3], [1000,2000, 3000]);
    await multiSigAdmin.setCapsuleAddress(capsule.address);

    await _LoANFT.modifyNFTs(true, [1,2,3,4,5,6,7,8,9,10], [1,1,1,1,1,1,1,1,1,1], [1,2,1,2,1,2,1,2,1,2],[1,1,1,1,1,1,1,1,1,1]);

    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.deploy(multiSigAdmin.address);
    await _LoANFTAttributes.deployed();

    await multiSigAdmin.setNFTAttributeAddress(_LoANFTAttributes.address);

    await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5,6,7,8,9,10], ["1-0-0", "1-2-0", "1-3-0", "1-4-0", "1-5-0", "2-0-1", "2-0-1", "2-0-1", "2-2-1", "2-0-2"]);
    console.log(12);

    await loa.connect(addr1).approve(_LoANFT.address, "20000000000000000000");

    console.log("ready to mint nft");
    await _LoANFT.connect(addr1).mint(5);
    await _LoANFT.connect(addr1).mint(4);
    console.log("nft minted");


    console.log(await _LoANFT.getUserNFTs(addr1.address));

    
    
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.deploy(loa.address, multiSigAdmin.address);
    await _NFTMarket.deployed();

    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    await multiSigAdmin.setMarketAddress(_NFTMarket.address);
    // await multiSigAdmin.updateContractAddresses([capsule.address, capsuleStaking.address, _NFTMarket.address]);
    
    await _NFTMarket.updateFees([_LoANFT.address, capsule.address], ["20000000000000000000", "10000000000000000000"], [50, 40]);
    
    await multiSigAdmin.setCapsuleAddress(capsule.address);
    await _LoANFT.connect(addr1).setApprovalForAll(_NFTMarket.address, true);
    await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
    await _NFTMarket.connect(addr1).list(_LoANFT.address, 10, "2000000000000000000000");
    await loa.connect(addr1).approve(_NFTMarket.address, "20000000000000000000");
    await _NFTMarket.connect(addr1).list(_LoANFT.address, 9, "2000000000000000000000");
    
    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    await loa.connect(addr2).approve(_NFTMarket.address, "2000000000000000000000");
    await _NFTMarket.connect(addr2).buy(1);
    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    
    console.log("\n\n", await _NFTMarket.getMarketItem(2));


    await loa.connect(addr2).approve(_NFTMarket.address, "20000000000000000000");
    await _LoANFT.connect(addr2).setApprovalForAll(_NFTMarket.address, true);
    await _NFTMarket.connect(addr2).list(_LoANFT.address, 10, "2000000000000000000000");


    console.log("\n\n", await _NFTMarket.fetchMarketItems());
    await loa.connect(addr3).approve(_NFTMarket.address, "2000000000000000000000");
    await _NFTMarket.connect(addr3).buy(3);

  });


});


