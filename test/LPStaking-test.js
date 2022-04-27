const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");



describe("LP-Staking ", function () {

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // it("LP-Staking test", async function () {

  //   const [owner, addr1, addr2] = await ethers.getSigners();


  //   const LOA = await ethers.getContractFactory("LOA");
  //   const loa = await LOA.deploy();
  //   await loa.deployed();

    
  //   const LPToken = await ethers.getContractFactory("LOA");
  //   const lpToken = await LPToken.deploy();
  //   await lpToken.deployed();
    
  //   // expect(await loa.balanceOf(owner.address)).to.equal(100000);
  //   expect(await loa.balanceOf(addr1.address)).to.equal(0);


  //   const LPStaking = await ethers.getContractFactory("LPStaking");
  //   const lpStaking = await LPStaking.deploy(loa.address, lpToken.address);
  //   await lpStaking.deployed();


  //   loa.transfer(lpStaking.address, 1000000000000);
  //   await lpStaking.setRewardsPerSecond(1000000000000);
  //   await lpStaking.updateWithdrawalFee([180, 90, 30, 14, 7], [0, 100, 200, 300, 400, 500]);

  //   // console.log(await lpStaking._withdrawDays());
  //   // console.log(await lpStaking._withdrawFee());

  //   expect(await lpToken.balanceOf(owner.address)).to.equal('1000000000000000000000000000');
  //   await lpToken.approve(lpStaking.address, 100000);
  //   await lpStaking.stake(100000);

  //   // await timeout(5000);

  //   expect(await lpToken.balanceOf(owner.address)).to.equal('999999999999999999999900000');
  //   await lpStaking.unstake(100000);
  //   expect(await lpToken.balanceOf(owner.address)).to.equal('999999999999999999999950000');


  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999999000000000000');
  //   await lpToken.approve(lpStaking.address, 50000);
  //   await lpStaking.stake(50000);

  //   // await timeout(5000);


  //   expect(await lpToken.balanceOf(owner.address)).to.equal('999999999999999999999900000');
  //   await lpStaking.distributeRewards();

  //   console.log(await lpStaking.myRewards());
  //   await lpStaking.unstake(50000);


  //   console.log(await loa.balanceOf(owner.address));
  //   // console.log(await lpStaking.myRewards(owner.address));

  //   // expect(await loa.balanceOf(owner.address)).to.equal(100);

  // });
  

  // it("LP-Staking test", async function () {

  //   const [owner, addr1, addr2] = await ethers.getSigners();


  //   const LOA = await ethers.getContractFactory("LOA");
  //   const loa = await LOA.deploy();
  //   await loa.deployed();

    
  //   // const LPToken = await ethers.getContractFactory("LOA");
  //   // const lpToken = await LPToken.deploy();
  //   // await lpToken.deployed();
    
  //   // expect(await loa.balanceOf(owner.address)).to.equal(100000);
  //   expect(await loa.balanceOf(addr1.address)).to.equal(0);


  //   const LPStaking = await ethers.getContractFactory("LPStaking");
  //   const lpStaking = await LPStaking.deploy(loa.address, loa.address);
  //   await lpStaking.deployed();


  //   loa.transfer(lpStaking.address, 1000000000000);
  //   await lpStaking.setRewardsPerSecond(1000000000000);
  //   // await lpStaking.updateWithdrawalFee([180, 90, 30, 14, 7], [0, 100, 200, 300, 400, 500]);
  //   await lpStaking.updateWithdrawalFee([180, 90, 30, 14, 7], [0, 1, 2, 3, 4, 5]);

  //   // console.log(await lpStaking._withdrawDays());
  //   // console.log(await lpStaking._withdrawFee());

  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999999000000000000');
  //   await loa.approve(lpStaking.address, 100000);
  //   await lpStaking.stake(100000);

  //   // await timeout(5000);

  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999998999999900000');
  //   await lpStaking.unstake(100000);
  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999998999999950000');


  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999998999999950000');
  //   await loa.approve(lpStaking.address, 50000);
  //   await lpStaking.stake(50000);

  //   // await timeout(5000);


  //   expect(await loa.balanceOf(owner.address)).to.equal('999999999999998999999900000');
  //   await lpStaking.distributeRewards();

  //   console.log(await lpStaking.myRewards());
  //   await lpStaking.unstake(50000);


  //   console.log(await loa.balanceOf(owner.address));
  //   // console.log(await lpStaking.myRewards(owner.address));

  //   // expect(await loa.balanceOf(owner.address)).to.equal(100);

  // });



 










  // it("LP-Staking test", async function () {

  //   const [owner, addr1, addr2] = await ethers.getSigners();


  //   const LOA = await ethers.getContractFactory("LOA");
  //   const loa = await LOA.deploy();
  //   await loa.deployed();
  //   expect(await loa.balanceOf(addr1.address)).to.equal(0);

  //   const LPStaking = await ethers.getContractFactory("LPStaking");
  //   const lpStaking = await LPStaking.deploy(loa.address, loa.address);
  //   await lpStaking.deployed();

  //   let ownerBalance = await waffle.provider.getBalance(owner.address);
  //   let lpBalance = await waffle.provider.getBalance(lpStaking.address);

  //   console.log(ownerBalance);
  //   console.log(lpBalance);

  //   await owner.sendTransaction({
  //     to: lpStaking.address,
  //     value: ethers.utils.parseEther("1") // 1 ether
  //   });

  //   console.log(ethers.utils.parseEther("1"));

  //   // await lpStaking.test1(ethers.utils.parseEther("1"));

  //   console.log(await waffle.provider.getBalance(owner.address));
  //   console.log(await waffle.provider.getBalance(lpStaking.address));

  //   console.log('ownerBalance: ', ownerBalance - await waffle.provider.getBalance(owner.address));
  //   console.log('lpBalance: ', await waffle.provider.getBalance(lpStaking.address));

  //   // // await lpStaking.test2(1000000000);

  //   // console.log(await waffle.provider.getBalance(owner.address));
  //   // console.log(await waffle.provider.getBalance(lpStaking.address));


  // });


  it("LP-Staking test", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const LOA = await ethers.getContractFactory("LOA");
    const loa = await LOA.deploy();
    await loa.deployed();
    expect(await loa.balanceOf(addr1.address)).to.equal(0);


    const LP = await ethers.getContractFactory("LOA");
    const lp = await LOA.deploy();
    await lp.deployed();
    expect(await lp.balanceOf(addr1.address)).to.equal(0);
    await lp.transfer(addr1.address, 5000);
    await lp.transfer(addr2.address, 3000);
    
    
    const LPStaking = await ethers.getContractFactory("LPStaking");
    const lpStaking = await LPStaking.deploy(loa.address, lp.address);
    await lpStaking.deployed();
    

    await loa.transfer(addr1.address, 5000);
    await loa.transfer(addr2.address, 3000);
    expect(await loa.balanceOf(addr1.address)).to.equal(5000);
    await loa.transfer(lpStaking.address, 1000000);
    
    await lpStaking.setRewardsPerSecond(100);
    await lpStaking.updateWithdrawalFee([180, 90, 30, 14, 7], [0, 100, 200, 300, 400, 500]);
    
    await lp.connect(addr1).approve(lpStaking.address, 5000);
    await lp.connect(addr2).approve(lpStaking.address, 3000);
    await lpStaking.connect(addr1).stake(1000);
    console.log('addr1', await loa.balanceOf(addr1.address));
    console.log('lpStaking', await loa.balanceOf(lpStaking.address));
    console.log('_rewardPerTokenCumulative', await lpStaking._rewardPerTokenCumulative());
    
    console.log();
    console.log();
    console.log();
    
    
    await lpStaking.connect(addr2).stake(1000);
    console.log('addr1', await loa.balanceOf(addr1.address));
    console.log('lpStaking', await loa.balanceOf(lpStaking.address));
    console.log('_rewardPerTokenCumulative', await lpStaking._rewardPerTokenCumulative());
    
    console.log();
    console.log();
    console.log();
    
    await lpStaking.connect(addr1).stake(1000);
    console.log('addr1', await loa.balanceOf(addr1.address));
    console.log('lpStaking', await loa.balanceOf(lpStaking.address));
    console.log('_rewardPerTokenCumulative', await lpStaking._rewardPerTokenCumulative());

    console.log('_tokenStaked', await lpStaking._tokenStaked(addr1.address));


    expect(await lpStaking._tokenStaked(addr1.address)).to.equal(2000);
    expect(await lpStaking._tokenStaked(addr2.address)).to.equal(1000);
    
    await lpStaking.connect(addr1).unstake(2000);
    await lpStaking.connect(addr2).unstake(1000);

    expect(await lpStaking._tokenStaked(addr2.address)).to.equal(0);
    expect(await lpStaking._tokenStaked(addr1.address)).to.equal(0);

    console.log('addr1', await loa.balanceOf(addr1.address));
    console.log('lpStaking', await loa.balanceOf(lpStaking.address));
    console.log('_rewardPerTokenCumulative', await lpStaking._rewardPerTokenCumulative());
    console.log('_tokenStaked', await lpStaking._tokenStaked(addr1.address));

  });

});


