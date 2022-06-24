const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    // const RAFFLE_ADDRESS = "0x2f095725205b8B5eED43D4De10d33888a64CBcd1";

    // const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    // const capsule = "0x6cE6a3b07a1182dE44a43cd566Ff88Fd4a72aC60";
    // const capsuleStaking = "0x33dfA3020363cDC4DF91A26A2D618F5A64EE1532";
    // const _NFTMarket = "0x632F468665629654C6923c38fEbD037e440e3a6B";
    // const _LoANFTFusion = "0xE31eEca0abE6f7f35d1f207ab2BE9f756026e255";
    // const _LoANFT = "0x723da64fB4Eda7A89f5Ce7D42A39f2385325ff11";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.attach("0xb53A259A5B7C30e3954DAe521c05c599d178046a");
    
    // console.log(await capsule._capsule_status(1));
    // console.log(await capsule._capsule_status(2));
    // console.log(await capsule._capsule_status(3));
    // console.log(await capsule._capsule_status(4));
    // console.log(await capsule._capsule_status(5));
    // console.log(await capsule._capsule_status(6));
    // console.log(await capsule._capsule_status(7));
    // console.log(await capsule._capsule_status(8));
    // console.log(await capsule._capsule_status(9));

    // await capsule.modifyCapsules(true, [11, 12, 13, 14, 15, 16, 17, 18, 19 ,20], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    await capsule.modifyCapsules(true, [11, 12, 13, 14, 15, 16, 17, 18, 19 ,20], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    await capsule.modifyCapsules(true, [21, 22, 23, 24, 25, 26, 27, 28, 29 ,30], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    
}

main();