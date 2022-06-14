const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Adding Capsules...");

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.attach("0x2a243A016E0DdCeE477685F7800730848Ea543AE");
    
    await capsule.modifyCapsules(true, 
      [11, 12, 13, 14, 15, 16, 17, 18, 19 ,20, 21, 22, 23, 24, 25, 26, 27, 28, 29 ,30, 41, 42, 43, 44, 45, 46, 47, 48, 49 ,50, 51, 52, 53, 54, 55, 56, 57, 58, 59 ,60], 
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
   //  await capsule.modifyCapsules(true, [], [], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
   //  await capsule.modifyCapsules(true, [51, 52, 53, 54, 55, 56, 57, 58, 59 ,60], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

}

main();