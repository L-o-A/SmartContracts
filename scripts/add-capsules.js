const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");

   const capsule = await (await ethers.getContractFactory("Capsule")).attach("0xC6FD3b4A75f50622ec69FFE7C80cd14048673488");
   const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0x444fFeE9C8B7C7B93Fd184125707C28069d4E8B6');

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

   const caps = await _capsuleData.getUserCapsules("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da");

   console.log("caps", caps);
   // for (let index = 0; index < caps.length; index++) {
   //    console.log(caps[index], await _capsuleData.getCapsuleDetail(caps[index]));
   // }
   await capsule.airdrop(1, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   await capsule.airdrop(2, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   await capsule.airdrop(3, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   await capsule.airdrop(4, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   await capsule.airdrop(5, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);

   // await capsule.airdrop(1, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(2, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(3, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(4, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);
   // await capsule.airdrop(5, "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB", 2);

   console.log("added");
}

main();