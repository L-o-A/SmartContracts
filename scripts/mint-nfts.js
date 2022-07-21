const { expect } = require("chai");
const { ethers } = require("hardhat");



async function main() {
    console.log("Minting...");

    const user = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    // multiSigAdmin.address : 0xa21e13444b75fFEBd8B5f6BD7D526c61F87185AB
    // raffleHelper.address : 0x7e31F872460a9fdd89F5c49570ceeC988270DBAb
    // raffle.address : 0xeb500C3f67f0a794EDec6d33e01f85826494a34F
    // capsule.address : 0xe93e8b45ae6b8B00D1551f0359d013B4a59C7297
    // capsuleData.address : 0xb46a97FB88BAcCcA92637BbCcf601fCee9D4EB99
    // capsuleStaking.address : 0x29942D05a41319851FAAc2EEa99caE247B510839
    // _LoANFTData.address : 0xf4b0BbB500Ea98c36495C50D96050456204d5979
    // _LoANFT.address : 0x68E9aCd9b99dc9eD771214Ade788C6fc7af7aC07
    // _LoANFTFusion.address : 0x0CC89576f0Ba20fc28941c17Ec5Ba09E99633256
    // _NFTMarket.address : 0x53F3C54Ab3e592343C07025ADBF4E36D1060Eff8

    const _multiSigAdmin = await (await ethers.getContractFactory("MultiSigAdmin")).attach("0xa21e13444b75fFEBd8B5f6BD7D526c61F87185AB");
    const _LoANFT = await (await ethers.getContractFactory("LoANFT")).attach('0x68E9aCd9b99dc9eD771214Ade788C6fc7af7aC07');
    const _LoANFTData = await (await ethers.getContractFactory("LoANFTData")).attach('0xf4b0BbB500Ea98c36495C50D96050456204d5979');
    const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0xb46a97FB88BAcCcA92637BbCcf601fCee9D4EB99');

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


