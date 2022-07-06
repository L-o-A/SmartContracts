const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Setting LOA Attributes...");

    const LOANFT_ATTRIBUTE_ADDRESS = "0xAaDDe1Bde72bf8B0D2f56815088201568566470d";

    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.attach(LOANFT_ATTRIBUTE_ADDRESS);

    const level = 1;

    console.log(await _LoANFTData._nft_level_to_total_added(level));

    console.log(0);

    // await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);

    let BASE_ID = await _LoANFTData._nft_level_to_total_added(level);

    console.log("BASE_ID", BASE_ID);

    for (let i = 0; i < BASE_ID; i++) {
        const element = await _LoANFTData._nft_attributes(i);
        console.log(i, element);
    }

    // BASE_ID = 56;
    // await _LoANFTData.modifyNFTs(true, [BASE_ID + 1, BASE_ID + 2, BASE_ID + 3, BASE_ID + 4, BASE_ID + 5, BASE_ID + 6, BASE_ID + 7, BASE_ID + 8, BASE_ID + 9, BASE_ID + 10],
    //     [level, level, level, level, level, level, level, level, level, level],
    //     [1,2,1,2,1,2,1,2,1,2],
    //     [1,1,1,1,1,1,1,1,1,1]);

    console.log(1);

    // for (let i = 0; i < 10; i++) {

    // await _LoANFTData.putNFTAttributes([BASE_ID + 1, BASE_ID + 2, BASE_ID + 3, BASE_ID + 4, BASE_ID + 5, BASE_ID + 6, BASE_ID + 7, BASE_ID + 8],
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
        // BASE_ID = BASE_ID + 8;
        console.log("BASE_ID", BASE_ID);
// }
}

main();