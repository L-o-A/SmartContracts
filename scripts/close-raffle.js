const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    // const RAFFLE_ADDRESS = "0x052d4cc5F70B0BdBc90E46ac4140bB8892121f14";

    // const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    // const capsule = "0x223c3Ec7D9113E20dE4a3D5C1afFdC24501fC8b9";

    // const Raffle = await ethers.getContractFactory("Raffle");
    // const raffle = await Raffle.attach(RAFFLE_ADDRESS);
    
    // const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    // const oneDayAgo = parseInt(new Date().getTime()/1000 - 86400  + "");
    
    // // await raffle.setRaffleData(1, twoDaysAgo + "", oneDayAgo + "", capsule, treasury);
    // console.log("raffle closed")
    
    // await raffle.pickWinner(10);
    // console.log("winners declared")



    const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
    const _LoANFTAttributes = await LoANFTAttributes.attach("0x0BBD1B3D155503a7060405155fa6EAa7D45749E3");



// await _LoANFTAttributes.putNFTAttributeNames("HER0,MAX-HP,MAX-PARNA,MAXSPEED,HP-REGEN,PRANA-REGEN,ATTACK-DAMAGE,ATTACK-SPEED,CRITICAL-DAMAGE,ARMOUR,MAGIC-DEFENCE");

// await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5], 
//     [
//         "1-3-4-1-2-3-4-5-6-7-8", 
//         "2-4-5-2-2-3-4-5-6-7-8", 
//         "3-5-6-3-2-3-4-5-6-7-8", 
//         "4-6-7-4-2-3-4-5-6-7-8", 
//         "5-7-8-5-2-3-4-5-6-7-8", 
//     ]);
await _LoANFTAttributes.putNFTAttributes([6,7], 
    [
        "6-8-9-6-2-3-4-5-6-7-8", 
        "7-9-0-7-2-3-4-5-6-7-8", 
    ]);
// await _LoANFTAttributes.putNFTAttributes([9,10], 
//     [
//         "9-1-2-8-2-3-4-5-6-7-8", 
//         "10-2-3-1-2-3-4-5-6-7-8"
//     ]);
}

main();