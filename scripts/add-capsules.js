const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");
   loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

   const capsule = await (await ethers.getContractFactory("Capsule")).attach("0xe93e8b45ae6b8B00D1551f0359d013B4a59C7297");
   const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0xb46a97FB88BAcCcA92637BbCcf601fCee9D4EB99');
   const _capsuleStaking = await (await ethers.getContractFactory("CapsuleStaking")).attach('0x29942D05a41319851FAAc2EEa99caE247B510839');

   let capsules = await _capsuleData.getUserCapsules("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da");
   console.log("caps", capsules);
   // for (let f = 0; f < capsules.length; f++) {
   //    console.log(capsules[f], await _capsuleData.getCapsuleDetail(capsules[f]));
   // }

   // let finalCaps = [];
   // for (let f = 0; f < 3; f++) {
   //    finalCaps.push(capsules[f]);
   // }

   // await loa.approve(_capsuleStaking.address, "200000000000000000000000000000");
   // await capsule.setApprovalForAll(_capsuleStaking.address, true);
   // await _capsuleStaking.stake(finalCaps);

   const staked = await _capsuleStaking.fetchStakedCapsules("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da")
   // for (let f = 0; f < staked.length; f++) {
   //    console.log(staked[f], await _capsuleData.getCapsuleDetail(staked[f]));
   // }
   let finalStaked = [];
   for (let f = 0; f < 3; f++) {
      finalStaked.push(staked[f]);
   }
   await _capsuleStaking.reclaim(finalStaked, false);

   // console.log("getCapsuleSupply 1", await _capsuleData.getCapsuleSupply(1));
   // console.log("getCapsuleSupply 2", await _capsuleData.getCapsuleSupply(2));
   // console.log("getCapsuleSupply 3", await _capsuleData.getCapsuleSupply(3));
   // console.log("getCapsuleSupply 4", await _capsuleData.getCapsuleSupply(4));
   // console.log("getCapsuleSupply 5", await _capsuleData.getCapsuleSupply(5));

   // await _capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
   // await _capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
   // await _capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
   // await _capsuleData.addCapsuleSupply(4, [8], [3080]);
   // await _capsuleData.addCapsuleSupply(5, [9], [100]);


   // await capsule.airdrop(1, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 5);
   // await capsule.airdrop(2, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(3, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(4, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(5, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);

   // await capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(3, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(4, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(5, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);

   console.log("added");
}

main();