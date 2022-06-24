const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";

    
    const capsule = "0xb53A259A5B7C30e3954DAe521c05c599d178046a";

    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.attach("0x830fd6c2686813084eE5C762cfcdfe91E794319b");
    

    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
    await raffleHelper.deployed();
    console.log("raffleHelper.address :", raffleHelper.address);


    /**
     *  function putRafflePrices(
        uint256[] memory supply,
        uint256[] memory prices,
        uint64[] memory reward_amount,
        uint256[] memory reward_range
        
    )
     */
    await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(loa, raffleHelper.address);
    await raffle.deployed();
    console.log("raffle.address :", raffle.address);


    await raffleHelper.setRaffle(raffle.address);
    console.log(1);

    /**
     * function setRaffleData(
        uint8 category,
        uint256 startTime,
        uint256 endTime,
        address capsuleAddress,
        address treasury
    )
     */
    const twoDaysAgo = parseInt(new Date().getTime()/1000 - 2 * 86400 + "");
    const oneDayAgo = parseInt(new Date().getTime()/1000 + 2* 86400  + "");
    
    await raffle.setRaffleData(1, twoDaysAgo + "", oneDayAgo + "", capsule, treasury);
    console.log(2);
    
    multiSigAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(3);
}

main();