const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";


    const capsule = "0x2a243A016E0DdCeE477685F7800730848Ea543AE";

    const LOAAdmin = await ethers.getContractFactory("LOAAdmin");
    const loaAdmin = await LOAAdmin.attach("0xbe10acc4aDbBB710C52F31203635DC87f1Dee556");


    const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
    const raffleHelper = await RaffleHelper.deploy(loaAdmin.address);
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
    await raffleHelper.putRafflePrices([10, 40, 100], ["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

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
    await raffle.setRaffleData(1, 10, 199999999999, capsule, treasury);
    console.log(2);

    loaAdmin.modifyRaffleAddress(raffle.address, true);
    console.log(3);
}

main();