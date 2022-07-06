const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");

   // const Capsule = await ethers.getContractFactory("Capsule");
   // const capsule = await Capsule.attach("0xcf42951d10D9BeAd202f335278A0fF8b6Fbfb24b");

   const CapsuleData = await ethers.getContractFactory("CapsuleData");
   const capsuleData = await CapsuleData.attach("0x8C6e22139134796C081327fba53489aA5B9167fc");

   const base = 340;
   await capsuleData.modifyCapsules(true,
      [base + 1, base + 2, base + 3, base + 4, base + 5, base + 6, base + 7, base + 8, base + 9, base + 10, base + 11, base + 12, base + 13, base + 14, base + 15, base + 16, base + 17, base + 18, base + 19, base + 20, base + 21, base + 22, base + 23, base + 24, base + 25, base + 26, base + 27, base + 28, base + 29, base + 30, base + base + 31, base + 32, base + 33, base + 34, base + 35, base + 36, base + 37, base + 38, base + 39, base + 40],
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