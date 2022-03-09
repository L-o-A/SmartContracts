const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("CAPSULE ", function () {

  it("Capsule Test put remove airdrop", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await capsule.putCapsules([1, 2, 3, 4],  [1,1,1,1], [1,1,1,1], [1644589943, 1644589943, 1644589943, 1644589943]);
    

    //Test Airdrop
    await capsule.airdrop(1, addr1.address);
    expect(await capsule._capsule_status(4)).to.equal(2);

    expect(await capsule.getCapsuleStatus(4)).to.equal(2);


  });


});


