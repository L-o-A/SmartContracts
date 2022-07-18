const { expect } = require("chai");
const { ethers } = require("hardhat");



async function main() {
    console.log("Minting...");

    // const [owner, addr1, addr2] = await ethers.getSigners();
    const user = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";

    const _LoANFT = await (await ethers.getContractFactory("LoANFT")).attach('0x02F83a21d0516f028D51EBBA5560d7e5Ce7F0cbb');
    const _LoANFTData = await (await ethers.getContractFactory("LoANFTData")).attach('0x3c4F2e0ce4f151e9552d51D29cAF89088e058877');
    const _capsuleData = await (await ethers.getContractFactory("CapsuleData")).attach('0x444fFeE9C8B7C7B93Fd184125707C28069d4E8B6');

    const capsules = await _capsuleData.getUserCapsules(user);

    console.log(capsules);
    // console.log("len", capsules.length);
    // console.log("getNFTDetail", await _LoANFTData.getNFTDetail(1));

    // return;

    let cap = capsules[capsules.length - 1];
    // console.log("cap", cap);
    cap = 4;
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
    console.log("minted");


}
main();


