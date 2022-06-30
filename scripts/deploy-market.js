const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0xb1E95C89893354C5A0Dbff233d56cB072E03ce78";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"

    const nft = "0x6c73041c14fffbd1deD66466C3F4Af7306fCd0B6";
    const capsule = "0xcf42951d10D9BeAd202f335278A0fF8b6Fbfb24b";

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.deploy(loa, multiSigAdminAddr);
    await _NFTMarket.deployed()
    console.log("_NFTMarket.address :", _NFTMarket.address);

    // const NFTMarket = await ethers.getContractFactory("NFTMarket");
    // const _NFTMarket = await NFTMarket.attach("0xAc2ade0186B144882E11C8e4Ed591e3bd8350535");
    await _NFTMarket.updateFees([nft, capsule], ["200000000000000000000", "100000000000000000000"], [50, 50]);
    
    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach(multiSigAdminAddr);
    await multiSigAdmin.setMarketAddress(_NFTMarket.address);

    // await multiSigAdmin.updateContractAddresses(["0x09fc2cc0B9a34e75E564ebE60D53aF4189288493", 
    // "0x6cE6a3b07a1182dE44a43cd566Ff88Fd4a72aC60", 
    // "0x33dfA3020363cDC4DF91A26A2D618F5A64EE1532", 
    // "0x723da64fB4Eda7A89f5Ce7D42A39f2385325ff11",
    // "0x632F468665629654C6923c38fEbD037e440e3a6B",
    // "0x2f095725205b8B5eED43D4De10d33888a64CBcd1"
    // ])
    

}

main();