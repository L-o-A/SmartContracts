const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");
   loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

   const capsule = await (await ethers.getContractFactory("Capsule")).attach("0x0583A78979CD8F12Eb5B1B1F55a957D5Cefe7567");
   const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0x1D75E5855b752733C9bfF33848e127323aDb4A23');
   const _capsuleStaking = await (await ethers.getContractFactory("CapsuleStaking")).attach('0x744c927F01C8C04883A5c651ee9bff2f2854a55B');
   const user1 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";
   const user2 = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
   const user3 = "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2";

   // let capsules = await _capsuleData.getUserCapsules(user1);
   // // console.log("caps", capsules);
   // for (let f = 0; f < capsules.length; f++) {
   //    // console.log(capsules[f], await _capsuleData.getCapsuleDetail(capsules[f]));
   //    console.log(capsules[f], await capsule.balanceOf(user1, capsules[f]));
   // }
   // return;

   console.log("getCapsuleSupply 1", await _capsuleData.getCapsuleSupply(1));
   console.log("getCapsuleSupply 2", await _capsuleData.getCapsuleSupply(2));
   console.log("getCapsuleSupply 3", await _capsuleData.getCapsuleSupply(3));
   console.log("getCapsuleSupply 4", await _capsuleData.getCapsuleSupply(4));
   console.log("getCapsuleSupply 5", await _capsuleData.getCapsuleSupply(5));
// return;
   // await _capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
   // await _capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
   // await _capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
   // await _capsuleData.addCapsuleSupply(4, [8], [3080]);
   // await _capsuleData.addCapsuleSupply(5, [9], [100]);


   // await capsule.airdrop(1, user1, 5);
   // await capsule.airdrop(2, user1, 5);
   // await capsule.airdrop(3, user1, 5);
   // await capsule.airdrop(4, user1, 5);
   await capsule.airdrop(5, user1, 1);

   // await capsule.airdrop(1, user2, 5);
   // await capsule.airdrop(2, user2, 5);
   // await capsule.airdrop(3, user2, 5);
   // await capsule.airdrop(4, user2, 5);
   // await capsule.airdrop(5, user2, 5);

   // await capsule.airdrop(1, user3, 5);
   // await capsule.airdrop(2, user3, 5);
   // await capsule.airdrop(3, user3, 5);
   // await capsule.airdrop(4, user3, 5);
   // await capsule.airdrop(5, user3, 5);

   return;

   console.log("1");
   // let finalCaps = [];
   // for (let f = 0; f < 3; f++) {
   //    finalCaps.push(capsules[f]);
   // }

   // await loa.approve(_capsuleStaking.address, "200000000000000000000000000000");
   // console.log("loa approved");
   // await capsule.setApprovalForAll(_capsuleStaking.address, true);
   // console.log("capsule approved");
   // await _capsuleStaking.stake(finalCaps);
   // console.log("capsule staked");
   // return;

   const staked = await _capsuleStaking.fetchStakedCapsules(user)
   console.log("staked", staked.length);
   // for (let f = 0; f < staked.length; f++) {
   //    console.log(staked[f], await _capsuleData.getCapsuleDetail(staked[f]));
   // }
   console.log(2);
   let finalStaked = [];
   if (staked.length < 1) {
      console.log("no staked caps present");
      return;
   }
   for (let f = 0; f < 3; f++) {
      finalStaked.push(staked[f]);
   }
   console.log(3);
   if (finalStaked.length < 1) {
      console.log("no final staked caps present");
      return;
   }
   console.log(4);
   await _capsuleStaking.reclaim(finalStaked, false);

   console.log("reclaimed");
}

main();