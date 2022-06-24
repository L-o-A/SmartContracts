const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Closing Raffle...");

    const RAFFLE_ADDRESS = "0xAF3AA341055bD6FD449de97BB88Fa1C4bAB3fa56";

    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";
    const capsule = "0xb53A259A5B7C30e3954DAe521c05c599d178046a";
    // const capsuleStaking = "0x33dfA3020363cDC4DF91A26A2D618F5A64EE1532";
    // const _NFTMarket = "0x632F468665629654C6923c38fEbD037e440e3a6B";
    // const _LoANFTFusion = "0xE31eEca0abE6f7f35d1f207ab2BE9f756026e255";
    // const _LoANFT = "0x723da64fB4Eda7A89f5Ce7D42A39f2385325ff11";

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.attach(RAFFLE_ADDRESS);

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x830fd6c2686813084eE5C762cfcdfe91E794319b");
    
    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 - 86400  + "");
    
    // await raffle.setRaffleData(1, twoDaysAgo + "", oneDayAgo + "", capsule, treasury);

    console.log("raffle closed")
    await raffle.pickWinner(5);
    await raffle.pickWinner(5);
    await raffle.pickWinner(5);
    await raffle.pickWinner(5);
    

    
    // console.log("winners declared")
    
    await multiSigAdmin.modifyRaffleAddress([ raffle.address , 1])



//     const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
//     const _LoANFTAttributes = await LoANFTAttributes.attach("0xcb2BE4cA194486C4176C4e028658dBb02de4AE0b");



// // await _LoANFTAttributes.putNFTAttributeNames("HER0,MAX-HP,MAX-PARNA,MAXSPEED,HP-REGEN,PRANA-REGEN,ATTACK-DAMAGE,ATTACK-SPEED,CRITICAL-DAMAGE,ARMOUR,MAGIC-DEFENCE");

// await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5], 
//     [
//         "1-3-4-1-2-3-4-5-6-7-8", 
//         "2-4-5-2-2-3-4-5-6-7-8", 
//         "3-5-6-3-2-3-4-5-6-7-8", 
//         "4-6-7-4-2-3-4-5-6-7-8", 
//         "5-7-8-5-2-3-4-5-6-7-8", 
//     ]);
// await _LoANFTAttributes.putNFTAttributes([6,7,8], 
//     [
//         "9-1-2-8-0-0-0-0-6-7-8", 
//         "9-1-2-8-2-3-0-0-0-0-8", 
//         "10-2-0-0-0-0-4-5-6-7-8"
//     ]);
}

main();