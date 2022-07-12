// const { expect } = require("chai");
// const { ethers } = require("hardhat");



// describe("RAFFLE ", function () {



//   it("RAFFLE Test -5", async function () {

//     const [owner, addr1, addr2] = await ethers.getSigners();


//     const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
//     const multiSigAdmin = await MultiSigAdmin.deploy();
//     await multiSigAdmin.deployed();
    
//     const LoANFTData = await ethers.getContractFactory("LoANFTData");
//     const _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
//     await _LoANFTData.deployed();
    
//     await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);

//     await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5], 
//         [759500, 1299400, 108800, 72800], 
//         [651000, 1264300, 102400, 71400], 
//       [1], [50000], [10000], 1);

//     await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5],
//       [759500, 1299400, 108800, 72800],
//       [651000, 1264300, 102400, 71400],
//       [1], [50000], [10000], 1);

//     await _LoANFTData.populateAttribute(101, 1, 1);
//     await _LoANFTData.populateAttribute(102, 2, 1);
//     console.log("_LoANFTData.populateAttribute(101, 1, 1)");
//     await _LoANFTData.populateAttribute(103, 1, 1);
//     await _LoANFTData.populateAttribute(104, 2, 1);
//     console.log("_LoANFTData.populateAttribute(102, 1, 1)");
//     await _LoANFTData.populateAttribute(105, 1, 1);
//     await _LoANFTData.populateAttribute(106, 2, 1);
//     console.log("_LoANFTData.populateAttribute(103, 1, 1)");


//     console.log(await _LoANFTData.getNFTDetail(101));
//     console.log(await _LoANFTData.getNFTDetail(102));
//     console.log(await _LoANFTData.getNFTDetail(103));
//   });


// });


