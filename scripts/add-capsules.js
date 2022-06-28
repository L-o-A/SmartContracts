const { ethers, upgrades } = require("hardhat");

async function main() {
   console.log("Adding Capsules...");

   const Capsule = await ethers.getContractFactory("Capsule");
   const capsule = await Capsule.attach("0x3E1dA04d9B960083999B7AD148A19590B8b1Bce9");

   const CapsuleData = await ethers.getContractFactory("CapsuleData");
   const capsuleData = await CapsuleData.attach("0x1C45a93113811e5faB89e6E9615dfafB5929b28F");

   // await capsuleData.modifyCapsules(true,
   //    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
   //    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   //    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

   // await capsuleData.modifyCapsules(true, [61, 62, 63, 64, 65, 66, 67, 68, 69, 70], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
   // console.log(1);
   // await capsuleData.modifyCapsules(true, [71, 72, 73, 74, 75, 76, 77, 78, 79, 80], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
   // console.log(2);

   // await capsuleData.modifyCapsules(true, [81, 82, 83, 84, 85, 86, 87, 88, 89, 90], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
   // console.log(3);

   // await capsuleData.modifyCapsules(true, [91, 92, 93, 94, 95, 96, 97, 98, 99, 100], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
   // console.log(4);

   // await capsule.airdrop(2, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(3, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(4, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);
   // await capsule.airdrop(5, "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da", 2);

   await capsule.airdrop(2, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   await capsule.airdrop(3, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   await capsule.airdrop(4, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
   await capsule.airdrop(5, "0xD2eCFbb2A94431Da360f267eAa9183E53FDdeaE2", 2);
}

main();