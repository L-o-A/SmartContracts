const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("CAPSULE STAKING", function () {


  it("CapsuleStake Test", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);
    
    await loa.transfer(addr1.address, 100);
    expect(await loa.balanceOf(addr1.address)).to.equal(100);


    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await capsule.putCapsules([1, 2, 4, 5],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
    

    //Test Airdrop
    await capsule.airdrop(1, addr1.address);
    expect(await capsule._capsule_status(5)).to.equal(2);

    expect(await capsule.getCapsuleStatus(5)).to.equal(2);

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStakingContract = await CapsuleStaking.deploy(loa.address);
    await capsuleStakingContract.deployed();

    await capsule.setCapsuleStakingAddress(capsuleStakingContract.address);

    await capsuleStakingContract.setCapsuleContract(capsule.address);
    await capsuleStakingContract.setCapsuleStakingRule(1, 60, 100);

    await loa.connect(addr1).approve(capsuleStakingContract.address, 100);
    await capsule.connect(addr1).setApprovalForAll(capsuleStakingContract.address, true);
    await capsuleStakingContract.connect(addr1).stake([5]);
    // expect(await loa.balanceOf(addr1.address)).to.equal(0);

  });



  it("CapsuleStake Reclaim", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);
    
    await loa.transfer(addr1.address, 100);
    expect(await loa.balanceOf(addr1.address)).to.equal(100);


    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await capsule.putCapsules([1, 2, 4, 5],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
    

    //Test Airdrop
    await capsule.airdrop(1, addr1.address);
    expect(await capsule._capsule_status(5)).to.equal(2);

    expect(await capsule.getCapsuleStatus(5)).to.equal(2);

    const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
    const capsuleStakingContract = await CapsuleStaking.deploy(loa.address);
    await capsuleStakingContract.deployed();

    await capsule.setCapsuleStakingAddress(capsuleStakingContract.address);

    await capsuleStakingContract.setCapsuleContract(capsule.address);
    await capsuleStakingContract.setCapsuleStakingRule(1, 0, 100);

    await loa.connect(addr1).approve(capsuleStakingContract.address, 100);
    await capsule.connect(addr1).setApprovalForAll(capsuleStakingContract.address, true);

    expect(await capsule.balanceOf(addr1.address, 5)).to.equal(1);

    // await capsuleStakingContract.connect(addr1).stake([5]);
    // expect(await loa.balanceOf(addr1.address)).to.equal(0);
    // expect(await loa.balanceOf(capsuleStakingContract.address)).to.equal(100);
    // expect(await capsule.balanceOf(addr1.address, 5)).to.equal(0);
    // expect(await capsule.balanceOf(capsuleStakingContract.address, 5)).to.equal(1);
    
    // await capsuleStakingContract.connect(addr1).reclaim([5]);
    // expect(await loa.balanceOf(addr1.address)).to.equal(100);
    // expect(await capsule.balanceOf(addr1.address, 5)).to.equal(1);

  });


});


