const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Adding NFTs...");

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach("0xaa830E7B5061E81083aF344777709C3E6DB7FA4A");


    await _LoANFTData.addNFTSupply(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075, 14075]);
    await _LoANFTData.addNFTSupply(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]);
    await _LoANFTData.addNFTSupply(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925, 5925]);
    await _LoANFTData.addNFTSupply(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1471, 1470, 1470, 1470, 1470, 1471, 1469, 1470, 1470, 1470]);
    await _LoANFTData.addNFTSupply(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [754, 755, 755, 755, 755, 754, 755, 755, 755, 755]);
    await _LoANFTData.addNFTSupply(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [435, 435, 435, 435, 435, 435, 436, 435, 435, 435]);
    await _LoANFTData.addNFTSupply(8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [400, 400, 400, 400, 400, 400, 400, 400, 400, 400]);
    await _LoANFTData.addNFTSupply(9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);

    console.log("added");
}

main();