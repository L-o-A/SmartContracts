const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Setting LOA Attributes...");

    const LOANFT_ATTRIBUTE_ADDRESS = "0xa17626B40D28C8C575D4c1341D185919174e2ba5";

    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.attach(LOANFT_ATTRIBUTE_ADDRESS);

    var idPassed = 0;
    for (let i = 0; i < 1; i++) {
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
    }

    // multiSigAdmin.address : 0x9272491201C84BeB70174cA9a3172E847291e6b3
    // raffleHelper.address : 0xDABe206CACA024d74248D56033843D75Fe1ae3D4
    // raffle.address : 0xD9B4061A5CdcabeB3F7f98f5CDBE0Bd862e897Af
    // capsule.address : 0xD26637BC0faa6eaD1e2Cb28c880Ff9c1E0201601
    // capsuleStaking.address : 0xBaeFdD3C899DDd670D304C184079c54f5EcD65C0
    // _LoANFT.address : 0x20dB0e4B61928AcDA53dC1fe7236829561861a5d
    // _LoANFTAttributes.address : 0xa17626B40D28C8C575D4c1341D185919174e2ba5
    // _LoANFTFusion.address : 0x1266B343c5885A01B882563a0C4CB8ae06dbe7b6
    // _NFTMarket.address : 0x853ade678423D50122eC8EBAa78e04CfaD7eA934
}

main();