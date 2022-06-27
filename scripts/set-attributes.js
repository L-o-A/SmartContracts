const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Setting LOA Attributes...");

    const LOANFT_ATTRIBUTE_ADDRESS = "0xA03Be7bE11cb7952139eD7Ca8B31F3bA95b5Fa02";

    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.attach(LOANFT_ATTRIBUTE_ADDRESS);

    var idPassed = 8;
    // for (let i = 0; i < 10; i++) {
        await _LoANFTAttributes.putNFTAttributes([idPassed + 1, idPassed + 2, idPassed + 3, idPassed + 4, idPassed + 5, idPassed + 6, idPassed + 7, idPassed + 8],
            [
                "3-5-6-3-0-0-0-0-7-8-2",
                "4-6-7-4-2-3-0-0-0-0-3",
                "5-7-8-5-2-3-4-0-0-0-0",
                "1-3-4-1-0-0-0-0-6-7-8",
                "2-4-0-0-0-0-4-5-6-7-8",
                "3-5-6-3-0-0-0-0-7-8-2",
                "4-6-7-4-2-3-0-0-0-0-3",
                "5-7-8-5-2-3-4-0-0-0-0",
            ]);
        idPassed = idPassed + 8;
        console.log("idPassed", idPassed);
    // }
}

main();