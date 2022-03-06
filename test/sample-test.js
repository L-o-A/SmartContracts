// const { expect } = require("chai");
// const { ethers } = require("hardhat");


// const WALLET_ADDR_1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
// const WALLET_ADDR_2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
// const delay = ms => new Promise(res => setTimeout(res, ms));



// describe("RAFFLE ", function () {

  
//   it("RAFFLE Test", async function () {

//     const [owner, addr1, addr2] = await ethers.getSigners();
    
//     const LOA = await ethers.getContractFactory("LOA");
//     const loa = await LOA.deploy();
//     await loa.deployed();
    
//     expect(await loa.balanceOf(WALLET_ADDR_1)).to.equal(100000);
//     expect(await loa.balanceOf(WALLET_ADDR_2)).to.equal(0);


//     const Raffle = await ethers.getContractFactory("Raffle");
//     const raffle = await Raffle.deploy(loa.address);
//     await raffle.deployed();

//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy();
//     await capsule.deployed();

//     await raffle.setCapsuleAddress(capsule.address);

//     await raffle.putRaffle(1, 100, 1, 3, 10, 1999999999999);
//     await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);

//     // expect(await raffle._raffle_status(1)).to.equal(1);
//     // expect(await raffle._raffle_status(2)).to.equal(1);
    
//     // await raffle.removeRaffle(2);
//     // expect(await raffle._raffle_status(2)).to.equal(0);

//     // await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);


//     await loa.connect(owner).transfer(addr1.address, 2000);
//     await loa.connect(addr1).approve(raffle.address, 2000);
//     await loa.approve(raffle.address, 2000);

//     await raffle.connect(addr1).buyTicket(1, 10);


//     await raffle.putRaffle(1, 100, 1, 3, 10, 200000);

    
//     expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(3)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(4)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(5)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(6)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(7)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(8)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(9)).to.equal(addr1.address);
//     expect(await raffle._ticket_owner(10)).to.equal(addr1.address);
    
    
//     await raffle.pickWinner(1);
    
//     const balance = await loa.balanceOf(addr1.address);
//     console.log(balance);

//     expect(await loa.balanceOf(addr1.address)).to.equal( parseInt(balance));
    
//     await raffle.connect(addr1).withdraw();

//     expect(await loa.balanceOf(addr1.address)).to.equal( parseInt(balance) + 700);

//   });
// });




// describe("CAPSULE ", function () {

//   it("Capsule Test", async function () {
//     const LOA = await ethers.getContractFactory("LOA");
//     const loa = await LOA.deploy();
//     await loa.deployed();
    
//     expect(await loa.balanceOf(WALLET_ADDR_1)).to.equal(100000);
//     expect(await loa.balanceOf(WALLET_ADDR_2)).to.equal(0);


//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy();
//     await capsule.deployed();

//     //Test putCapuses && removeCapsules
//     /**
//      *  uint256[] memory ids,
//         uint256[] memory prices,
//         uint8[] memory levels,
//         uint256[] memory startTimes
//      */
//     await capsule.putCapsules([1,2,3], [1,1,2], [1,1,1], [1644589943, 1644589943, 1644589943]);
    
//     expect(await capsule._capsule_status(1)).to.equal(1);
//     expect(await capsule._capsule_status(2)).to.equal(1);
//     expect(await capsule._capsule_status(3)).to.equal(1);
    
//     await capsule.removeCapsules([1,2]);

//     expect(await capsule._capsule_status(1)).to.equal(0);
//     expect(await capsule._capsule_status(2)).to.equal(0);
//     expect(await capsule._capsule_status(3)).to.equal(1);

//     await capsule.putCapsules([1,2, 4, 5],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
    
//     expect(await capsule._capsule_status(1)).to.equal(1);
//     expect(await capsule._capsule_status(2)).to.equal(1);
//     expect(await capsule._capsule_status(3)).to.equal(1);
//     expect(await capsule._capsule_status(4)).to.equal(1);
//     expect(await capsule._capsule_status(5)).to.equal(1);
    

//     //Test Airdrop
//     await capsule.airdrop(1, WALLET_ADDR_2);
//     expect(await capsule._capsule_status(5)).to.equal(2);


//   });
// });



// describe("LOA ", function () {
//   it("LOA NFT Test", async function () {
//     const LOA = await ethers.getContractFactory("LOA");
//     const loa = await LOA.deploy();
//     await loa.deployed();

//     expect(await loa.balanceOf(WALLET_ADDR_1)).to.equal(100000);
//     expect(await loa.balanceOf(WALLET_ADDR_2)).to.equal(0);

//     loa.transfer(WALLET_ADDR_2, 1000);
//     expect(await loa.balanceOf(WALLET_ADDR_2)).to.equal(1000);

    
//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy();
//     await capsule.deployed();

//     const LOAnft = await ethers.getContractFactory("LOAnft");
//     const loaNFT = await LOAnft.deploy(loa.address);
//     await loaNFT.deployed();

//     await capsule.setNFTAddress(loaNFT.address);
//     await loaNFT.setCapsuleAddress(capsule.address);

    
//     //Test putCapuses && removeCapsules
//     /**
//      *  uint256[] memory ids,
//         uint256[] memory prices,
//         uint8[] memory levels,
//         uint256[] memory startTimes
//      */
//     await capsule.putCapsules([1,2, 3, 4],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
  
//     await loaNFT.putNFTs([1,2,3,4,5],[1,1,1,2,2], [1,1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943, 1644589943]);

//     expect(await loaNFT._nft_status(1)).to.equal(1);
//     expect(await loaNFT._nft_status(2)).to.equal(1);
//     expect(await loaNFT._nft_status(3)).to.equal(1);
//     expect(await loaNFT._nft_status(4)).to.equal(1);
//     expect(await loaNFT._nft_status(5)).to.equal(1);

//     await loaNFT.removeNFTs([1,2,3,4,5]);

//     expect(await loaNFT._nft_status(1)).to.equal(0); // status unpublished
//     expect(await loaNFT._nft_status(2)).to.equal(0);
//     expect(await loaNFT._nft_status(3)).to.equal(0);
//     expect(await loaNFT._nft_status(4)).to.equal(0);
//     expect(await loaNFT._nft_status(5)).to.equal(0);

//     await loaNFT.putNFTs([1,2,3,4,5],[1,1,1,2,2], [1,1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943, 1644589943]);


//     expect(await loaNFT._nft_status(1)).to.equal(1); // status ready to mint
//     expect(await loaNFT._nft_status(2)).to.equal(1); // status ready to mint
//     expect(await loaNFT._nft_status(3)).to.equal(1); // status ready to mint
//     expect(await loaNFT._nft_status(4)).to.equal(1); // status ready to mint
//     expect(await loaNFT._nft_status(5)).to.equal(1); // status ready to mint

//     const [owner, addr1, addr2] = await ethers.getSigners();

//     await capsule.airdrop(1, addr1.address);
//     await capsule.airdrop(1, addr1.address);

//     expect(await capsule._capsule_status(3)).to.equal(2);
//     expect(await capsule._capsule_status(4)).to.equal(2);
    
//     await loaNFT.connect(addr1).mint(3);
//     await loaNFT.connect(addr1).mint(4);
    
//     expect(await capsule._capsule_status(4)).to.equal(3);//status burned
//     expect(await loaNFT._nft_status(3)).to.equal(2); // status minted
    
//     expect(await capsule._capsule_status(3)).to.equal(3);//status burned
//     expect(await loaNFT._nft_status(2)).to.equal(2); // status minted
    
    
//     await loaNFT.createFusionRule(1, 100, 2, [1,1]);
//     expect(await loaNFT._fusion_rule_price(1)).to.equal(100);
    
//     await loaNFT.removeFusionRule(1);
//     expect(await loaNFT._fusion_rule_price(1)).to.equal(0);
    
//     await loaNFT.createFusionRule(1, 250, 2, [1,1]);
//     expect(await loaNFT._fusion_rule_price(1)).to.equal(250);

//     await loa.connect(addr1).approve(loaNFT.address, 250);

//     await loaNFT.connect(addr1).fusion(1, [2,3]);
//     expect(await loa.balanceOf(addr1.address)).to.equal(750);
//     expect(await loaNFT._nft_status(5)).to.equal(2);
    
//     expect(await loaNFT.balanceOf(addr1.address, 5)).to.equal(1);

//     // await loaNFT.connect(addr1).rent(5, addr2.address, Math.round(new Date().getTime()/1000) + 4);
//     // expect(await loaNFT.balanceOf(addr2.address, 5)).to.equal(1);
//     // expect(await loaNFT.balanceOf(addr1.address, 5)).to.equal(0);

//     // await delay(5000);

//     // await loaNFT.connect(addr1).reacquire(5); 
//     // expect(await loaNFT.balanceOf(addr2.address, 5)).to.equal(0);
//     // expect(await loaNFT.balanceOf(addr1.address, 5)).to.equal(1);

//   });


// });