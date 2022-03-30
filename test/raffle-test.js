const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("RAFFLE ", function () {

  
  it("RAFFLE Test -1", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa.address);
    await raffle.deployed();

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await raffle.setCapsuleAddress(capsule.address);

    await raffle.putRaffle(1, 100, 1, 3, 10, 1999999999999);
    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);

    expect(await raffle._raffle_status(1)).to.equal(1);
    expect(await raffle._raffle_status(2)).to.equal(1);
    
    await raffle.removeRaffle(2);
    expect(await raffle._raffle_status(2)).to.equal(0);

    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);


    await loa.connect(owner).transfer(addr1.address, 2000);
    await loa.connect(addr1).approve(raffle.address, 2000);

    await raffle.connect(addr1).buyTicket(1, 10);

    //update raffle event details (end time)
    await raffle.putRaffle(1, 100, 1, 10, 10, 200000);

    
    expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(3)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(4)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(5)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(6)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(7)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(8)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(9)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(10)).to.equal(addr1.address);
    
    
    await raffle.pickWinner(1);
    
    const balance = await loa.balanceOf(addr1.address);
    console.log(balance);

    expect(await raffle.balanceOf(addr1.address, 1)).to.equal(1);
    expect(await loa.balanceOf(addr1.address)).to.equal(1000);

  });


  it("RAFFLE Test -2", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa.address);
    await raffle.deployed();

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await raffle.setCapsuleAddress(capsule.address);

    await raffle.putRaffle(1, 100, 1, 3, 10, 1999999999999);
    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);

    expect(await raffle._raffle_status(1)).to.equal(1);
    expect(await raffle._raffle_status(2)).to.equal(1);
    
    await raffle.removeRaffle(2);
    expect(await raffle._raffle_status(2)).to.equal(0);

    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);


    await loa.connect(owner).transfer(addr1.address, 20000);
    await loa.connect(owner).transfer(addr2.address, 50000);

    await loa.connect(addr1).approve(raffle.address, 20000);
    await raffle.connect(addr1).buyTicket(1, 200);

    // await loa.connect(addr2).approve(raffle.address, 50000);
    // await raffle.connect(addr2).buyTicket(1, 500);

    //update raffle event details (end time)
    await raffle.putRaffle(1, 100, 1, 10, 10, 200000);

    
    await raffle.pickWinner(1);
    
    await raffle.connect(addr1).withdraw();
    expect(await raffle.balanceOf(addr1.address, 1)).to.equal(1);

    expect(await loa.balanceOf(addr1.address)).to.equal(19000);

  });


  it("RAFFLE Test -3", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa.address);
    await raffle.deployed();

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await raffle.setCapsuleAddress(capsule.address);

    await raffle.putRaffle(1, 100, 1, 3, 10, 1999999999999);
    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);

    expect(await raffle._raffle_status(1)).to.equal(1);
    expect(await raffle._raffle_status(2)).to.equal(1);
    
    await raffle.removeRaffle(2);
    expect(await raffle._raffle_status(2)).to.equal(0);

    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);


    await loa.connect(owner).transfer(addr1.address, 2000);
    await loa.connect(addr1).approve(raffle.address, 2000);

    await raffle.connect(addr1).buyTicket(1, 3);

    //update raffle event details (end time)
    await raffle.putRaffle(1, 100, 1, 10, 10, 200000);

    
    expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
    expect(await raffle._ticket_owner(3)).to.equal(addr1.address);
    
    
    await raffle.pickWinner(1);
    
    const balance = await loa.balanceOf(addr1.address);
    console.log(balance);

    expect(await raffle.balanceOf(addr1.address, 1)).to.equal(1);
    expect(await loa.balanceOf(addr1.address)).to.equal(1700);

  });


});




