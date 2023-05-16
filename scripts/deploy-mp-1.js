// const { ethers, upgrades } = require("hardhat");

// async function main() {
//     console.log("Deploying Market Place...");

//     const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
//     const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";

//     const LOAAdmin = await ethers.getContractFactory("LOAAdmin");
//     const loaAdmin = await LOAAdmin.deploy();
//     await loaAdmin.deployed();
//     console.log("loaAdmin.address :", loaAdmin.address);

//     // await loaAdmin.initialize();
//     console.log(-2);
//     await loaAdmin.modifyAdmin(treasury, true);
//     console.log(-1);
//     await loaAdmin.setTreasury(treasury);
//     console.log(0);

//     const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
//     const raffleHelper = await RaffleHelper.deploy(loaAdmin.address);
//     await raffleHelper.deployed();
//     console.log("raffleHelper.address :", raffleHelper.address);


//     /**
//      *  function putRafflePrices(
//         uint256[] memory supply,
//         uint256[] memory prices,
//         uint64[] memory reward_amount,
//         uint256[] memory reward_range
        
//     )
//      */
//     await raffleHelper.putRafflePrices([10,40, 100],["10000000000000000000", "20000000000000000000", "30000000000000000000", "40000000000000000000"], [100, 200, 400], [150, 300]);

//     const Raffle = await ethers.getContractFactory("Raffle");
//     const raffle = await Raffle.deploy(loa, raffleHelper.address);
//     await raffle.deployed();
//     console.log("raffle.address :", raffle.address);

//     const Capsule = await ethers.getContractFactory("Capsule");
//     const capsule = await Capsule.deploy(loaAdmin.address);
//     await capsule.deployed()
//     console.log("capsule.address :", capsule.address);

//     const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
//     const capsuleStaking = await CapsuleStaking.deploy(loa, loaAdmin.address);
//     await capsuleStaking.deployed()
//     console.log("capsuleStaking.address :", capsuleStaking.address);

//     const LoANFT = await ethers.getContractFactory("LoANFT");
//     const _LoANFT = await LoANFT.deploy(loa, loaAdmin.address);
//     await _LoANFT.deployed()
//     console.log("_LoANFT.address :", _LoANFT.address);
    
//     const LoANFTAttributes = await ethers.getContractFactory("LoANFTAttributes");
//     const _LoANFTAttributes = await LoANFTAttributes.deploy(loaAdmin.address);
//     await _LoANFTAttributes.deployed()
//     console.log("_LoANFTAttributes.address :", _LoANFTAttributes.address);
    
//     const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
//     const _LoANFTFusion = await LoANFTFusion.deploy(loa, _LoANFT.address, loaAdmin.address);
//     await _LoANFTFusion.deployed()
//     console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    
//     const NFTMarket = await ethers.getContractFactory("NFTMarket");
//     const _NFTMarket = await NFTMarket.deploy(loa, _LoANFT.address, loaAdmin.address);
//     await _NFTMarket.deployed()
//     console.log("_NFTMarket.address :", _NFTMarket.address);
    
//     console.log(1);
    
//     // const AxionSphere = await ethers.getContractFactory("AxionSphere");
//     // const _AxionSphere = await AxionSphere.deploy(loaAdmin.address);
//     // await _AxionSphere.deployed()
//     // console.log("_AxionSphere.address :", _AxionSphere.address);


//     /**
//      * function putRafflePrices(
//         uint256[] memory supply,
//         uint256[] memory prices,
//         uint64[] memory reward_amount,
//         uint256[] memory reward_range
//     )
//      */

//     await raffleHelper.setRaffle(raffle.address);
//     console.log(2);

//     /**
//      * function setRaffleData(
//         uint8 category,
//         uint256 startTime,
//         uint256 endTime,
//         address capsuleAddress,
//         address treasury
//     )
//      */
//     await raffle.setRaffleData(1, 10, 199999999999, capsule.address, treasury);
//     console.log(3);

//     /**
//      * function setAddresses(address loaNFTAddress, address nftMarketAddress, address capsuleStakingAddress)
//      */
//     await capsule.setAddresses(_LoANFT.address, _NFTMarket.address, capsuleStaking.address);
//     console.log(4);


//     /**
//      * function modifyCapsules(
//         bool add,
//         uint256[] memory ids,
//         uint8[] memory levels,
//         uint8[] memory types
//     )
//      */
//     await capsule.modifyCapsules(true, [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
//     console.log(5);
    
//     /**
//      * function setCapsuleStakingRule(uint8 capsuleType, uint32 stakingDays, uint256 loaTokens)
//      */
//     await capsuleStaking.setCapsuleStakingRule(1, 0, 1000);
//     console.log(6);

//     /**
//      * function modifyCapsules(
//         bool add,
//         uint256[] memory ids,
//         uint8[] memory levels,
//         uint8[] memory types
//     )
//      */
//     await capsuleStaking.setAddresses(capsuleStaking.address);
//     console.log(7);

//     /**
//      * function updateAccessAddressAndFees (
//         address capsuleContract, 
//         address nftMarketAddress,
//         address fusion_address,
//         address loaNFTAttributeAddress,
//         uint8[] memory capsuleTypes,
//         uint256[] memory fees)
//      */
//     await _LoANFT.updateAccessAddressAndFees(capsule.address, _NFTMarket.address, _LoANFTFusion.address, _LoANFTAttributes.address, [1, 2, 3], [1000, 2000, 3000]);
//     console.log(8);

//     /**
//      *  function modifyNFTs(bool add,
//         uint256[] memory ids,
//         uint8[] memory levels,
//         uint8[] memory heroes,
//         uint256[] memory startTimes
//     )
//      */
//     await _LoANFT.modifyNFTs(true, [1,2,3,4,5,6,7,8,9,10], [1,1,1,1,1,1,1,1,1,1], [1,2,1,2,1,2,1,2,1,2],[1,1,1,1,1,1,1,1,1,1]);
//     console.log(9);

//     await _LoANFTAttributes.setNFTAddress(_LoANFT.address);
//     console.log(10);
//     await _LoANFTAttributes.putNFTAttributeNames("PRANA,HP,ATTACK");
//     console.log(11);

//     /**
//      * function putNFTAttributes (uint256[] memory ids, string[] memory attribs)
//      */
//     await _LoANFTAttributes.putNFTAttributes([1,2,3,4,5,6,7,8,9,10], ["1-0-0", "1-2-0", "1-3-0", "1-4-0", "1-5-0", "2-0-1", "2-0-1", "2-0-1", "2-2-1", "2-0-2"]);
//     console.log(12);


//     /**
//      * function createFusionRule(
//         uint256 id,
//         uint256 price,
//         uint8 resultLevel,
//         uint8[] memory levelValues
//     )
//      */
//     await _LoANFTFusion.createFusionRule(1, "1000000000000000000000", 2, [1,1]);
//     console.log(13);

//     /**
//      * function updateFees (
//         address[] memory contractAddresses, 
//         uint256[] memory fees)
//      */
//     await _NFTMarket.updateFees([_LoANFT.address], ["100000000000000000000"]);
//     console.log(14);
    
//     await loaAdmin.modifyRaffleAddress(raffle.address, true);
//     console.log(15);
// }

// main();