const { expect } = require("chai");
const { ethers } = require("hardhat");



async function main() {
    console.log("Minting...");

    // const [owner, addr1, addr2] = await ethers.getSigners();
    const user = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const LoANFT = await ethers.getContractFactory("LoANFT");
    const _LoANFT = await LoANFT.attach('0xe571DD4cE3b09552E8b1e825571359E5c8346428');

    const _LoANFTData = await (await ethers.getContractFactory("LoANFTData")).attach('0x8C2f2a23b230b3e3539020c04C2EFF66defdf9F9');

    console.log(user);

    const CapsuleData = await ethers.getContractFactory("CapsuleData");
    const _capsuleData = await CapsuleData.attach('0x414a9790372780f5d1e37aB3120F3526AC1cd282');

    const capsules = await _capsuleData.getUserCapsules(user);

    console.log(capsules); //['1', '2', '13', '14', '15', '16']
    console.log("len", capsules.length);

    let cap = capsules[capsules.length - 1];
    console.log("cap", cap);
    // cap = 18;
    const detail = await _capsuleData.getCapsuleDetail(cap);
    console.log("detail", detail);
    const _minting_fee = await _LoANFTData._minting_fee(detail[0]);
    console.log("_minting_fee", _minting_fee);

    // return;

    const loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");
    // await loa.approve(_LoANFT.address, "20000000000000000000000");
    // await loa.approve(_LoANFT.address, "2000000000000000000000");
    await loa.approve(_LoANFT.address, _minting_fee);

    console.log("ready to mint nft");
    await _LoANFT.mint(cap);

}
main();


