const { expect } = require("chai");
const { ethers } = require("hardhat");



async function main() {
    console.log("Minting...");

    const user = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const _multiSigAdmin = await (await ethers.getContractFactory("MultiSigAdmin")).attach("0x66A86D15849f39E461Ae4B23e9CF1aa8ED66D1Fc");
    const _LoANFT = await (await ethers.getContractFactory("LoANFT")).attach('0x142AdBb712C9e152038B338207b641eb697720CD');
    const _LoANFTData = await (await ethers.getContractFactory("LoANFTData")).attach('0xf989A58F93346eb78Ab07Afc12cE13C01d932c40');
    const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0x1D75E5855b752733C9bfF33848e127323aDb4A23');

    const capsules = await _capsuleData.getUserCapsules(user);

    // console.log(capsules);
    // console.log("len", capsules.length);
    // console.log("getNFTDetail", await _LoANFTData.getNFTDetail(1));

    // return;

    const unlocked = [];
    for (let i = 0; i < capsules.length; i++) {
        const detail = await _capsuleData.getCapsuleDetail(capsules[i]);
        if (detail[2] == 4) {
            unlocked.push(capsules[i]);
        }
    }

    console.log("unlocked", unlocked.length);
    if (unlocked.length < 1) {
        console.log("no capsules unlocked");
        return;
    }

    let cap = unlocked[0];
    // console.log("cap", cap);
    const detail = await _capsuleData.getCapsuleDetail(cap);
    // console.log("detail", detail);
    const _minting_fee = await _LoANFTData._minting_fee(detail[0]);
    // console.log("_minting_fee", _minting_fee);

    const loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");
    await loa.approve(_LoANFT.address, _minting_fee);

    console.log("ready to mint nft");
    await _LoANFT.mint(cap);
    console.log("minted");
}
main();


