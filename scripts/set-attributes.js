const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Setting LOA Attributes...");

    const LOANFT_ATTRIBUTE_ADDRESS = "0x6F963D518B259A00d30552eb12a91821B69C2a48";

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach(LOANFT_ATTRIBUTE_ADDRESS);

    console.log(await _LoANFTData._nft_level_to_total_added(1));

    console.log(0);

    await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);

    // await _LoANFTData.modifyNFTs(true, [1,2,3,4,5,6,7,8,9,10], [1,1,1,1,1,1,1,1,1,1], [1,2,1,2,1,2,1,2,1,2],[1,1,1,1,1,1,1,1,1,1]);

    console.log(1);

    var idPassed = 0;
    // for (let i = 0; i < 10; i++) {
        // await _LoANFTData.putNFTAttributes([idPassed + 1, idPassed + 2, idPassed + 3, idPassed + 4, idPassed + 5, idPassed + 6, idPassed + 7, idPassed + 8],
        //     [
        //         "3-5-6-3-0-0-0-0-7-8-2",
        //         "4-6-7-4-2-3-0-0-0-0-3",
        //         "5-7-8-5-2-3-4-0-0-0-0",
        //         "1-3-4-1-0-0-0-0-6-7-8",
        //         "2-4-0-0-0-0-4-5-6-7-8",
        //         "3-5-6-3-0-0-0-0-7-8-2",
        //         "4-6-7-4-2-3-0-0-0-0-3",
        //         "5-7-8-5-2-3-4-0-0-0-0",
        //     ]);
        idPassed = idPassed + 8;
        console.log("idPassed", idPassed);
    // }
}

main();