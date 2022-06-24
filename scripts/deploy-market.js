const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market...");

    const multiSigAdminAddr = "0x830fd6c2686813084eE5C762cfcdfe91E794319b";
    loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"

    const nft = "0xDb55845EA253A5a22Ce194b147ef6F0bF111E747";
    const capsule = "0xb53A259A5B7C30e3954DAe521c05c599d178046a";

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const _NFTMarket = await NFTMarket.deploy(loa, multiSigAdminAddr);
    await _NFTMarket.deployed()
    console.log("_NFTMarket.address :", _NFTMarket.address);

    // // const NFTMarket = await ethers.getContractFactory("NFTMarket");
    // // const _NFTMarket = await NFTMarket.attach("0x52c7A18758a01E588562aBbb7Fb87195D2414074");
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