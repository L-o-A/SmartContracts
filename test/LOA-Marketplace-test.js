// const { expect } = require("chai");
// const { ethers } = require("hardhat");


// describe("LOA MarketPlace", function () {

//   it("LOA MarketPlace Test", async function () {

//     const [owner, addr1, addr2] = await ethers.getSigners();
//     const LOA = await ethers.getContractFactory("LOA");
//     const loa = await LOA.deploy();
//     await loa.deployed();


//     loa.transfer(addr1.address, 6000);
//     loa.transfer(addr2.address, 3000);
//     expect(await loa.balanceOf(addr1.address)).to.equal(6000);

    
//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy();
//     await capsule.deployed();

//     const LOAnft = await ethers.getContractFactory("LOAnft");
//     const loaNFT = await LOAnft.deploy(loa.address);
//     await loaNFT.deployed();

//     const NFTMarket = await ethers.getContractFactory("NFTMarket");
//     const nftMarket = await NFTMarket.deploy(loa.address,loaNFT.address);
//     await nftMarket.deployed();

//     const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
//     const loaNFTFusion = await LoANFTFusion.deploy(loa.address,loaNFT.address);
//     await loaNFTFusion.deployed();

//     await capsule.setNFTAddress(loaNFT.address, nftMarket.address);
//     await loaNFT.updateAccessAddressAndFees(capsule.address, nftMarket.address, loaNFTFusion.address, [1], [100]);

//     loa.connect(addr1).approve(loaNFT.address, 300);
    
//     //Test putCapuses && removeCapsules
//     /**
//      *  uint256[] memory ids,
//         uint256[] memory prices,
//         uint8[] memory levels,
//         uint256[] memory startTimes
//      */
//     await capsule.putCapsules([1,2, 3, 4],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
//     await loaNFT.putNFTs([1,2,3,4,5],[1,1,1,2,2], [1,1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943, 1644589943]);

//     await capsule.airdrop(1, addr1.address);
//     await capsule.airdrop(1, addr1.address);

//     expect(await capsule._capsule_status(3)).to.equal(2);
//     expect(await capsule._capsule_status(4)).to.equal(2);
    
//     await loaNFT.connect(addr1).mint(3);
//     await loaNFT.connect(addr1).mint(4);

//     expect(await loaNFT._nft_status(3)).to.equal(2); // status minted
//     expect(await loaNFT._nft_status(2)).to.equal(2); // status minted


    

//     nftMarket.updateFees([capsule.address, loaNFT.address], [500, 1000]);
    
//     await loa.connect(addr1).approve(nftMarket.address, 1000);

//     await loaNFT.connect(addr1).setApprovalForAll(nftMarket.address, true);
//     await nftMarket.connect(addr1).list(loaNFT.address, 3, 2000);

//     await loa.connect(addr1).approve(nftMarket.address, 1000);
//     await loaNFT.connect(addr1).setApprovalForAll(nftMarket.address, true);
//     await nftMarket.connect(addr1).list(loaNFT.address, 2, 2500);

//     expect(await loaNFT.balanceOf(addr1.address, 3)).to.equal(0);
//     expect(await loa.balanceOf(addr1.address)).to.equal(3800);
    
//     let marketItem = await nftMarket.getMarketItem(1);
//     console.log(marketItem);
    
//     await nftMarket.connect(addr1).updatePrice(1, 3000);

//     marketItem = await nftMarket.getMarketItem(1);
//     console.log(marketItem);

//     marketItem = await nftMarket.connect(addr1).fetchMyListings();
//     console.log(marketItem);

//     await nftMarket.connect(addr1).unlist(1);
    
//     marketItem = await nftMarket.getMarketItem(1);
//     console.log(marketItem);

//     marketItem = await nftMarket.getMarketItem(2);
//     console.log(marketItem);
    
    
    
//     await loa.connect(addr2).approve(nftMarket.address, 2500);
//     expect(await loa.balanceOf(addr2.address)).to.equal(3000);

//     await nftMarket.connect(addr2).buy(2);
//     expect(await loa.balanceOf(addr2.address)).to.equal(500);

//     //Test gift
//     console.log(await loaNFT.balanceOf(addr2.address, 2));

//     await loaNFT.connect(addr2).setApprovalForAll(nftMarket.address, true);
//     expect(await loaNFT.balanceOf(addr1.address, 2)).to.equal(0);
//     await nftMarket.connect(addr2).giftNFT(addr1.address, 2);
//     expect(await loaNFT.balanceOf(addr1.address, 2)).to.equal(1);

//   });


// });