const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0x4a368401d56Bb8d402d3173A066ED32C4fd10332";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"

    const nft = "0xE7c8e821B8FE2496EB598CB724A1eA045163101c";
    const capsule = "0x223c3Ec7D9113E20dE4a3D5C1afFdC24501fC8b9";

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.deploy(loa, multiSigAdminAddr);
    await _NFTMarket.deployed()
    console.log("_NFTMarket.address :", _NFTMarket.address);

    // const NFTMarket = await ethers.getContractFactory("NFTMarket");
    // const _NFTMarket = await NFTMarket.attach("0x52c7A18758a01E588562aBbb7Fb87195D2414074");
    await _NFTMarket.updateFees([nft, capsule], ["200000000000000000000", "100000000000000000000"], [50, 50]);
    
    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);
    await multiSigAdmin.updateContractAddresses(["0x1c18D5EfBe08057212f6803638E8D5D449a9AFBD", "0x052d4cc5F70B0BdBc90E46ac4140bB8892121f14", "0x939411b2A50Ae3ab24bae02B906f5A3209eCeF36", "0xE7c8e821B8FE2496EB598CB724A1eA045163101c", _NFTMarket.address])
    

}

main();