const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("LOA-NFT-Fusion-Test", function () {

  it("LOA-NFT-Fusion-Test", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();


    loa.transfer(addr1.address, 1000);
    expect(await loa.balanceOf(addr1.address)).to.equal(1000);

    
    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    const LOAnft = await ethers.getContractFactory("LOAnft");
    const loaNFT = await LOAnft.deploy(loa.address);
    await loaNFT.deployed();

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy(loa.address,loaNFT.address);
    await nftMarket.deployed();


    const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
    const loaNFTFusion = await LoANFTFusion.deploy(loa.address,loaNFT.address);
    await loaNFTFusion.deployed();

    await capsule.setNFTAddress(loaNFT.address, nftMarket.address);
    await loaNFT.updateAccessAddressAndFees(capsule.address, capsule.address, loaNFTFusion.address, [1], [100]);

    loa.connect(addr1).approve(loaNFT.address, 300);
    
    //Test putCapuses && removeCapsules
    /**
     *  uint256[] memory ids,
        uint256[] memory prices,
        uint8[] memory levels,
        uint256[] memory startTimes
     */
    await capsule.putCapsules([1,2, 3, 4],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
  
    await loaNFT.putNFTs([1,2,3,4,5],[1,1,1,2,2], [1,1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943, 1644589943]);

    expect(await loaNFT._nft_status(1)).to.equal(1);
    expect(await loaNFT._nft_status(2)).to.equal(1);
    expect(await loaNFT._nft_status(3)).to.equal(1);
    expect(await loaNFT._nft_status(4)).to.equal(1);
    expect(await loaNFT._nft_status(5)).to.equal(1);

    await loaNFT.removeNFTs([1,2,3,4,5]);

    expect(await loaNFT._nft_status(1)).to.equal(0); // status unpublished
    expect(await loaNFT._nft_status(2)).to.equal(0);
    expect(await loaNFT._nft_status(3)).to.equal(0);
    expect(await loaNFT._nft_status(4)).to.equal(0);
    expect(await loaNFT._nft_status(5)).to.equal(0);

    await loaNFT.putNFTs([1,2,3,4,5],[1,1,1,2,2], [1,1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943, 1644589943]);


    expect(await loaNFT._nft_status(1)).to.equal(1); // status ready to mint
    expect(await loaNFT._nft_status(2)).to.equal(1); // status ready to mint
    expect(await loaNFT._nft_status(3)).to.equal(1); // status ready to mint
    expect(await loaNFT._nft_status(4)).to.equal(1); // status ready to mint
    expect(await loaNFT._nft_status(5)).to.equal(1); // status ready to mint

    await capsule.airdrop(1, addr1.address);
    await capsule.airdrop(1, addr1.address);

    expect(await capsule._capsule_status(3)).to.equal(2);
    expect(await capsule._capsule_status(4)).to.equal(2);
    
    await loaNFT.connect(addr1).mint(3);
    await loaNFT.connect(addr1).mint(4);

    expect(await capsule._capsule_status(4)).to.equal(6);//status burned
    expect(await loaNFT._nft_status(3)).to.equal(2); // status minted
    
    expect(await capsule._capsule_status(3)).to.equal(6);//status burned
    expect(await loaNFT._nft_status(2)).to.equal(2); // status minted
    
    
    await loaNFTFusion.createFusionRule(1, 100, 2, [1,1]);
    expect(await loaNFTFusion._fusion_rule_price(1)).to.equal(100);
    
    await loaNFTFusion.removeFusionRule(1);
    expect(await loaNFTFusion._fusion_rule_price(1)).to.equal(0);
    
    await loaNFTFusion.createFusionRule(1, 250, 2, [1,1]);
    expect(await loaNFTFusion._fusion_rule_price(1)).to.equal(250);

    
    
    await loa.connect(addr1).approve(loaNFTFusion.address, 250);
    await loaNFTFusion.connect(addr1).fusion(1, [2,3]);

    expect(await loa.balanceOf(addr1.address)).to.equal(550);
    expect(await loaNFT._nft_status(5)).to.equal(2);
    
    expect(await loaNFT.balanceOf(addr1.address, 5)).to.equal(1);

    console.log(await loaNFT.getNFTDetail(5));
  });


});