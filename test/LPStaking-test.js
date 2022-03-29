const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("LP-Staking ", function () {

  it("LP-Staking test", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();

    
    const LPToken = await ethers.getContractFactory("LOA");
    const lpToken = await LPToken.deploy();
    await lpToken.deployed();
    
    expect(await loa.balanceOf(owner.address)).to.equal(100000);
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const LPStaking = await ethers.getContractFactory("LPStaking");
    const lpStaking = await LPStaking.deploy(loa.address, lpToken.address);
    await lpStaking.deployed();


    await lpStaking.update(1000000000);
    await lpStaking.updateWithdrawalFee([180, 90, 30, 14, 7], [0, 100, 200, 300, 400, 500]);

    // console.log(await lpStaking._withdrawDays());
    // console.log(await lpStaking._withdrawFee());

    expect(await lpToken.balanceOf(owner.address)).to.equal(100000);
    await lpToken.approve(lpStaking.address, 100000);
    await lpStaking.stake(100000);
    expect(await lpToken.balanceOf(owner.address)).to.equal(0);
    await lpStaking.unstake();
    expect(await lpToken.balanceOf(owner.address)).to.equal(50000);


    // expect(await capsule._capsule_status(4)).to.equal(2);

  });


});


