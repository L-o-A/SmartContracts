const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("LOANFT MINT ", function () {
    it("LOANFT MINT -1", async function () {

        const [owner, addr1, addr2] = await ethers.getSigners();

        const LoANFT = await ethers.getContractFactory("LoANFT");
        const _LoANFT = await LoANFT.attach('0x5B3127585Cea15cB600f350C1CF220364dB9DD1d');

        const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
        const capsuleStaking = await CapsuleStaking.attach("0x0987AFEe94Ec81A6F6e7d4b354bd8085dbe97618");

        console.log(addr1);
        await capsuleStaking.stake([1, 2, 3]);
        await capsuleStaking.reclaim([1, 2, 3], false);
        await _LoANFT.mint([1, 2, 3]);

    });


});


