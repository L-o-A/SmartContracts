const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");

   // const Capsule = await ethers.getContractFactory("Capsule");
   // const capsule = await Capsule.attach("0xcf42951d10D9BeAd202f335278A0fF8b6Fbfb24b");

   const CapsuleData = await ethers.getContractFactory("CapsuleData");
   const capsuleData = await CapsuleData.attach("0x8C6e22139134796C081327fba53489aA5B9167fc");

   await capsuleData.modifyCapsules(true,
      [181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

   // await capsuleData.modifyCapsules(true, [61, 62, 63, 64, 65, 66, 67, 68, 69, 70], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
   // console.log(1);
   // await capsuleData.modifyCapsules(true, [71, 72, 73, 74, 75, 76, 77, 78, 79, 80], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
   // console.log(2);

   // await capsuleData.modifyCapsules(true, [81, 82, 83, 84, 85, 86, 87, 88, 89, 90], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
   // console.log(3);

   // await capsuleData.modifyCapsules(true, [91, 92, 93, 94, 95, 96, 97, 98, 99, 100], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
   // console.log(4);

   // await capsuleData.modifyCapsules(true, [91, 92, 93, 94, 95, 96, 97, 98, 99, 100], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
   // console.log(4);

   // await capsule.airdrop(2, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(3, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(4, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(5, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);

   // await capsule.airdrop(2, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   // await capsule.airdrop(3, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   // await capsule.airdrop(4, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   // await capsule.airdrop(5, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
}

main();