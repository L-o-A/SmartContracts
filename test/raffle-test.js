const { expect } = require("chai");
const { ethers } = require("hardhat");


const WALLET_ADDR_1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const WALLET_ADDR_2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const delay = ms => new Promise(res => setTimeout(res, ms));



describe("RAFFLE ", function () {

  
  it("RAFFLE Test", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    
    expect(await loa.balanceOf(WALLET_ADDR_1)).to.equal(100000);
    expect(await loa.balanceOf(WALLET_ADDR_2)).to.equal(0);


    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa.address);
    await raffle.deployed();

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy();
    await capsule.deployed();

    await raffle.setCapsuleAddress(capsule.address);

    await raffle.putRaffle(1, 100, 1, 3, 10, 1999999999999);
    await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);

    // expect(await raffle._raffle_status(1)).to.equal(1);
    // expect(await raffle._raffle_status(2)).to.equal(1);
    
    // await raffle.removeRaffle(2);
    // expect(await raffle._raffle_status(2)).to.equal(0);

    // await raffle.putRaffle(2, 200, 2, 3, 10, 1999999999999);


    await loa.connect(owner).transfer(addr1.address, 2000);
    await loa.connect(addr1).approve(raffle.address, 2000);
    await loa.approve(raffle.address, 2000);

    await raffle.connect(addr1).buyTicket(1, 3);


    await raffle.putRaffle(1, 100, 1, 3, 10, 200000);

    
    // expect(await raffle._ticket_owner(1)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(2)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(3)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(4)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(5)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(6)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(7)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(8)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(9)).to.equal(addr1.address);
    // expect(await raffle._ticket_owner(10)).to.equal(addr1.address);
    
    
    await raffle.pickWinner(1);
    
    const balance = await loa.balanceOf(addr1.address);
    console.log(balance);

    expect(await raffle.balanceOf(addr1.address, 1)).to.equal(3);
    
    // await raffle.connect(addr1).withdraw();
    // await raffle.setApprovalForAll(addr1, true);
    // await raffle.connect(addr1).safeTransferFrom(addr1, addr2, 1 , 2, "");

    // await raffle.balanceOf(1, 100, 1, 3, 10, 200000);

    expect(await loa.balanceOf(addr1.address)).to.equal( parseInt(balance) + 700);

  });
});

