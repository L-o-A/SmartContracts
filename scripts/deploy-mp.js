const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Market Place...");



    const treasury = "0xfFc9A7cd3b88D37d705b1c1Ce8bd87b13bAA59fB";


    const [owner] = await ethers.getSigners();

    console.log(owner.address);


    // const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
    //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN

    // const loaAdmin_addr = "0x3037c0161d3E2Fa8a5FE0bd7C254b1fDD151395a";
    // const _UTIL_address = "0x3a0E33d4beCd48b8e3d73E2d20EE0Bf54d433bf0";
    // const raffleHelper_addr = "0xC322ae9307a054eDc6438Bd40E77f7d5Bca2b536";
    // const raffle_addr = "0x19D5C503643A467F4338eb1FCbD0Da76562f7Ebf";
    // const capsule_addr = "0x8d80849956C4fF30A569fF1deb9CE78739f39418";
    // const capsuleData_addr = "0xC321413F01434519934D4A7BcCc83048eEe967cF";

    //SEPOLIA
    let loa = "0xee7c97685a230f3C70cf3Ec73Fbb8f659b7DBFD5"
    const loaAdmin_addr = "0x8777a7c8B05008CF5222d69b1472e4c6b6d28E0C";
    const _UTIL_address = "0x33a34C2A7c5c736a3Bc3533294F6c9fc687793d6";
    const raffleHelper_addr = "0xc457382A386da1f8fad0CC7787758Fb637EEc877";
    const raffle_addr = "0xE5A6Fb0303B3934815291d0aC471aB90939A9127";
    const capsule_addr = "0x8BF7D26b5f1aACA72E59CC1fFC2AabD390d62ebF";
    const capsuleData_addr = "0x257b42B9D50BfF4429fb97878d223CA0361E0C18";
    const capsuleStaking_addr = "0xd9B8A07A1A6b768ba0B294d248e4D693389cAb28";
    const _LoANFTData_addr = "0x6A2CBa5C83bcDf0147CbCFc4Aa0BB030620b7100";
    // const _LoANFT_addr = "0xB98463CE66ab7231b0EEA8585D7337f5e9A036D4";
    const _LoANFT_addr = null;
    const _LoANFTFusion_addr = "0xF56da78e2D6cB8437C9417E64294Ae84Be23532b";
    const _NFTMarket_addr = "0x00853356c468Ff73D8FBca7eA8955dcCdF07152e";



    const LOA = await ethers.getContractFactory("MYERC20");
    // loa = await LOA.deploy("LOA", "LOA");
    loa = await LOA.attach(loa);
    // await loa.deployed();

    console.log("loa.address :", loa.address);

    let loaAdmin;
    if (loaAdmin_addr != null) {
        const LOAAdmin = await ethers.getContractFactory("LOAAdmin");
        loaAdmin = await LOAAdmin.attach(loaAdmin_addr);
        console.log("loaAdmin.address :", loaAdmin.address);
    } else {
        const LOAAdmin = await ethers.getContractFactory("LOAAdmin");
        // loaAdmin = await LOAAdmin.deploy();
        loaAdmin = await upgrades.deployProxy(LOAAdmin, [], {
            initializer: "initialize",
        });
        await loaAdmin.deployed();
        console.log("loaAdmin.address :", loaAdmin.address);

        // await loaAdmin.modifyAdmin(admin2, true);
        // await loaAdmin.modifyAdmin(admin3, true);
        // await loaAdmin.modifyAdmin(treasury, true);
        await loaAdmin.setTreasury(treasury);
    }


    let _LOAUtil;
    if (_UTIL_address == null) {
        const LOAUtil = await ethers.getContractFactory("LOAUtil");
        // _LOAUtil = await LOAUtil.deploy();
        _LOAUtil = await upgrades.deployProxy(LOAUtil, [loaAdmin.address], {
            initializer: "initialize",
        });
        await _LOAUtil.deployed();
        console.log("LOAUtil.address :", _LOAUtil.address);
    } else {
        const LOAUtil = await ethers.getContractFactory("LOAUtil");
        _LOAUtil = await LOAUtil.attach(_UTIL_address);
        console.log("LOAUtil.address :", _LOAUtil.address);
    }


    let raffleHelper;
    if (raffleHelper_addr == null) {
        const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
        raffleHelper = await RaffleHelper.deploy(loaAdmin.address);
        await raffleHelper.deployed();
        console.log("raffleHelper.address :", raffleHelper.address);
    } else {
        const RaffleHelper = await ethers.getContractFactory("RaffleHelper");
        raffleHelper = await RaffleHelper.attach(raffleHelper_addr);
        console.log("raffleHelper.address :", raffleHelper.address);
    }


    let raffle;
    if (raffle_addr == null) {
        const Raffle = await ethers.getContractFactory("Raffle");
        raffle = await Raffle.deploy(loa.address, raffleHelper.address, loaAdmin.address);
        await raffle.deployed();
        console.log("raffle.address :", raffle.address);
    } else {
        const Raffle = await ethers.getContractFactory("Raffle");
        raffle = await Raffle.attach(raffle_addr);
        console.log("raffle.address :", raffle.address);
    }

    let capsule;
    if (capsule_addr == null) {
        const Capsule = await ethers.getContractFactory("Capsule");
        // capsule = await Capsule.deploy(loaAdmin.address);
        capsule = await upgrades.deployProxy(Capsule, [loaAdmin.address], {
            initializer: "initialize",
        });
        await capsule.deployed()
        console.log("capsule.address :", capsule.address);
    } else {
        const Capsule = await ethers.getContractFactory("Capsule");
        capsule = await Capsule.attach(capsule_addr);
        console.log("capsule.address :", capsule.address);
    }

    let capsuleData;
    if (capsuleData_addr == null) {
        const CapsuleData = await ethers.getContractFactory("CapsuleData");
        // capsuleData = await CapsuleData.deploy(loaAdmin.address);
        capsuleData = await upgrades.deployProxy(CapsuleData, [loaAdmin.address], {
            initializer: "initialize",
        });
        await capsuleData.deployed()
        console.log("capsuleData.address :", capsuleData.address);
    } else {
        const CapsuleData = await ethers.getContractFactory("CapsuleData");
        capsuleData = await CapsuleData.attach(capsuleData_addr);
        console.log("capsuleData.address :", capsuleData.address);
    }

    let capsuleStaking;
    if (capsuleStaking_addr == null) {
        const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
        capsuleStaking = await CapsuleStaking.deploy(loa.address, loaAdmin.address);
        await capsuleStaking.deployed()
        console.log("capsuleStaking.address :", capsuleStaking.address);
    } else {
        const CapsuleStaking = await ethers.getContractFactory("CapsuleStaking");
        capsuleStaking = await CapsuleStaking.attach(capsuleStaking_addr);
        console.log("capsuleStaking.address :", capsuleStaking.address);
    }

    let _LoANFTData;
    if (_LoANFTData_addr == null) {
        const LoANFTData = await ethers.getContractFactory("LoANFTData");
        // _LoANFTData = await LoANFTData.deploy(loaAdmin.address);
        _LoANFTData = await upgrades.deployProxy(LoANFTData, [loaAdmin.address], {
            initializer: "initialize",
        });
        await _LoANFTData.deployed()
        console.log("_LoANFTData.address :", _LoANFTData.address);
    } else {
        const LoANFTData = await ethers.getContractFactory("LoANFTData");
        _LoANFTData = await LoANFTData.attach(_LoANFTData_addr);
        console.log("_LoANFTData.address :", _LoANFTData.address);
    }

    let _LoANFT;
    if (_LoANFT_addr == null) {
        const LoANFT = await ethers.getContractFactory("LoANFT");
        _LoANFT = await LoANFT.deploy(loa.address, loaAdmin.address, _LoANFTData.address);
        await _LoANFT.deployed()
        console.log("_LoANFT.address :", _LoANFT.address);
    } else {
        const LoANFT = await ethers.getContractFactory("LoANFT");
        _LoANFT = await LoANFT.attach(_LoANFT_addr);
        console.log("_LoANFT.address :", _LoANFT.address);
    }



    let _LoANFTFusion;
    if (_LoANFTFusion_addr == null) {
        const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
        _LoANFTFusion = await LoANFTFusion.deploy(loa.address, _LoANFT.address, loaAdmin.address);
        await _LoANFTFusion.deployed()
        console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    } else {
        const LoANFTFusion = await ethers.getContractFactory("LoANFTFusion");
        _LoANFTFusion = await LoANFTFusion.attach(_LoANFTFusion_addr);
        console.log("_LoANFTFusion.address :", _LoANFTFusion.address);
    }

    let _NFTMarket;
    if (_NFTMarket_addr == null) {
        const NFTMarket = await ethers.getContractFactory("NFTMarket");
        _NFTMarket = await NFTMarket.deploy(loa.address, loaAdmin.address);
        await _NFTMarket.deployed()
        console.log("_NFTMarket.address :", _NFTMarket.address);
    } else {
        const NFTMarket = await ethers.getContractFactory("NFTMarket");
        _NFTMarket = await NFTMarket.attach(_NFTMarket_addr);
        console.log("_NFTMarket.address :", _NFTMarket.address);
    }

    // console.log(1);

    // await loaAdmin.setFusionAddress(_LoANFTFusion.address);
    // await loaAdmin.setMarketAddress(_NFTMarket.address);
    // await loaAdmin.setCapsuleAddress(capsule.address);
    // await loaAdmin.setCapsuleStakingAddress(capsuleStaking.address);
    // await loaAdmin.setCapsuleDataAddress(capsuleData.address);
    // await loaAdmin.setNFTDataAddress(_LoANFTData.address);
    // await loaAdmin.setNFTAddress(_LoANFT.address);
    // await loaAdmin.setUtilAddress(_LOAUtil.address);

    // await loaAdmin.modifyRaffleAddress(raffle.address, true);

    // await raffleHelper.putRafflePrices([500, 1000, 1500, 2500],
    //     ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"],
    //     [100, 200, 300, 400, 500], [500, 1000, 1500, 2500]);


    // await raffleHelper.setRaffle(raffle.address);
    // console.log(2);





    // await _LoANFTData.updateFees([1, 2, 3, 4, 5], ["1000000000000000000000", "2000000000000000000000", "3000000000000000000000", "3000000000000000000000", "3000000000000000000000"]);
    // await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);

    // await _LoANFTData.addNFTSupply(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);
    // await _LoANFTData.addNFTSupply(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
    // await _LoANFTData.addNFTSupply(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
    // await _LoANFTData.addNFTSupply(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    // await _LoANFTData.addNFTSupply(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    // await _LoANFTData.addNFTSupply(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    // await _LoANFTData.addNFTSupply(8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    // await _LoANFTData.addNFTSupply(9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

    // await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [976500, 1369700, 121600, 75600, 38900, 219200, 32800, 116000, 185000, 98000], [868000, 1334600, 115200, 74200, 38200, 211700, 31900, 112000, 178600, 94600], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1193500, 1439900, 134400, 78400, 40300, 234400, 34400, 124000, 197800, 104800], [1085000, 1404800, 128000, 77000, 39600, 226800, 33600, 120000, 191400, 101400], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1464800, 1527700, 150400, 81900, 42100, 253300, 36500, 134000, 213700, 113200], [1302000, 1475000, 140800, 79800, 41000, 241900, 35300, 128000, 204200, 108200], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1681800, 1598000, 163200, 84700, 43600, 268400, 38200, 142000, 226500, 120000], [1573300, 1562800, 156800, 83300, 42800, 260800, 37400, 138000, 220100, 116600], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1844500, 1650600, 172800, 86800, 44600, 279700, 39500, 148000, 236100, 125100], [1736000, 1615500, 166400, 85400, 43900, 272200, 38600, 144000, 229700, 121700], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2170000, 1756000, 192000, 91000, 46800, 302400, 42000, 160000, 255200, 135200], [2007300, 1703300, 182400, 88900, 45700, 291100, 40700, 154000, 245600, 130100], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2604000, 1896500, 217600, 96600, 49700, 332600, 45400, 176000, 280700, 148700], [2332800, 1808700, 201600, 93100, 47900, 313700, 43300, 166000, 264800, 140300], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3255000, 2107200, 256000, 105000, 54000, 378000, 50400, 200000, 319000, 169000], [2712500, 1931600, 224000, 98000, 50400, 340200, 46200, 180000, 287100, 152100], [1], [2228880], [2228811], 4);
    // console.log(17.1);
    // await _LoANFTData.addNFTAttributeLimits(1, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.2);
    // await _LoANFTData.addNFTAttributeLimits(1, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.3);
    // await _LoANFTData.addNFTAttributeLimits(1, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1112200, 1407500, 12400, 117500, 49900, 170100, 15100, 108000, 273800, 87500], [953300, 1369400, 6200, 115300, 49000, 163800, 14600, 104000, 263600, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1429900, 1483600, 24800, 122000, 51800, 182700, 16200, 116000, 294100, 94000], [1271000, 1445500, 18600, 119800, 50900, 176400, 15700, 112000, 283900, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1747700, 1559600, 37200, 126600, 53800, 195300, 17400, 124000, 314300, 100400], [1588800, 1521600, 31000, 124300, 52800, 189000, 16800, 120000, 304200, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2144900, 1654700, 52700, 132200, 56200, 211100, 18800, 134000, 339700, 108500], [1906600, 1597700, 43400, 128800, 54700, 201600, 17900, 128000, 324500, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2462600, 1730800, 65100, 136700, 58100, 223700, 19900, 142000, 360000, 115000], [2303800, 1692800, 58900, 134500, 57100, 217400, 19300, 138000, 349800, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2701000, 1787900, 74400, 140100, 59500, 233100, 20700, 148000, 375200, 119900], [2542100, 1749800, 68200, 137900, 58600, 226800, 20200, 144000, 365000, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3177600, 1902000, 93000, 146900, 62400, 252000, 22400, 160000, 405600, 129600], [2939300, 1844900, 83700, 143500, 61000, 242600, 21600, 154000, 390400, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3813100, 2054200, 117800, 155900, 66200, 277200, 24600, 176000, 446200, 142600], [3415900, 1959100, 102300, 150300, 63800, 261500, 23200, 166000, 420800, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 4, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [4766400, 2282400, 155000, 169500, 72000, 315000, 28000, 200000, 507000, 162000], [3972000, 2092200, 124000, 158200, 67200, 283500, 25200, 180000, 456300, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.4);
    // await _LoANFTData.addNFTAttributeLimits(1, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 5, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.5);
    // await _LoANFTData.addNFTAttributeLimits(1, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [776200, 986400, 108800, 79000, 45800, 177700, 15100, 108000, 188500, 87500], [665300, 959800, 102400, 77500, 44900, 171100, 14600, 104000, 181500, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [997900, 1039700, 121600, 82100, 47500, 190800, 16200, 116000, 202400, 94000], [887000, 1013100, 115200, 80600, 46600, 184200, 15700, 112000, 195400, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1219700, 1093100, 134400, 85100, 49300, 204000, 17400, 124000, 216400, 100400], [1108800, 1066400, 128000, 83600, 48400, 197400, 16800, 120000, 209400, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1496900, 1159700, 150400, 88900, 51500, 220400, 18800, 134000, 233800, 108500], [1330600, 1119700, 140800, 86600, 50200, 210600, 17900, 128000, 223400, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1718600, 1213000, 163200, 92000, 53200, 233600, 19900, 142000, 247800, 115000], [1607800, 1186400, 156800, 90400, 52400, 227000, 19300, 138000, 240800, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1885000, 1253000, 172800, 94200, 54600, 243500, 20700, 148000, 258300, 119900], [1774100, 1226400, 166400, 92700, 53700, 236900, 20200, 144000, 251300, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2217600, 1333000, 192000, 98800, 57200, 263200, 22400, 160000, 279200, 129600], [2051300, 1293000, 182400, 96500, 55900, 253300, 21600, 154000, 268700, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2661100, 1439600, 217600, 104900, 60700, 289500, 24600, 176000, 307100, 142600], [2383900, 1373000, 201600, 101100, 58500, 273100, 23200, 166000, 289700, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 6, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3326400, 1599600, 256000, 114000, 66000, 329000, 28000, 200000, 349000, 162000], [2772000, 1466300, 224000, 106400, 61600, 296100, 25200, 180000, 314100, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.6);
    // await _LoANFTData.addNFTAttributeLimits(1, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1364900, 1583400, 13200, 74900, 47800, 164700, 7600, 108000, 164700, 87500], [1251100, 1545700, 6600, 73400, 46900, 158600, 7300, 104000, 158600, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1592400, 1658800, 26400, 77800, 49700, 176900, 8100, 116000, 176900, 94000], [1478600, 1621100, 19800, 76300, 48800, 170800, 7800, 112000, 170800, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1819800, 1734200, 39600, 80600, 51500, 189100, 8700, 124000, 189100, 100400], [1706100, 1696500, 33000, 79200, 50600, 183000, 8400, 120000, 183000, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2104200, 1828500, 56100, 84200, 53800, 204400, 9400, 134000, 204400, 108500], [1933600, 1771900, 46200, 82100, 52400, 195200, 9000, 128000, 195200, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2331700, 1903900, 69300, 87100, 55700, 216600, 9900, 142000, 216600, 115000], [2217900, 1866200, 62700, 85700, 54700, 210500, 9700, 138000, 210500, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2502300, 1960400, 79200, 89300, 57000, 225700, 10400, 148000, 225700, 119900], [2388500, 1922700, 72600, 87800, 56100, 219600, 10100, 144000, 219600, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2843500, 2073500, 99000, 93600, 59800, 244000, 11200, 160000, 244000, 129600], [2672900, 2017000, 89100, 91400, 58400, 234900, 10800, 154000, 234900, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3298500, 2224300, 125400, 99400, 63500, 268400, 12300, 176000, 268400, 142600], [3014100, 2130100, 108900, 95800, 61200, 253200, 11600, 166000, 253200, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 7, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3980900, 2450500, 165000, 108000, 69000, 305000, 14000, 200000, 305000, 162000], [3412200, 2262000, 132000, 100800, 64400, 274500, 12600, 180000, 274500, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.7);
    // await _LoANFTData.addNFTAttributeLimits(1, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 8, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.8);
    // await _LoANFTData.addNFTAttributeLimits(1, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 9, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [2228880], [2228811], 4);
    // console.log(17.9);
    // await _LoANFTData.addNFTAttributeLimits(1, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [792800, 2821300, 13600, 81100, 43900, 164700, 15100, 108000, 177700, 87500], [679600, 2784600, 6800, 79600, 43000, 158600, 14600, 104000, 171100, 84200], [1], [5], [1], 1);
    // await _LoANFTData.addNFTAttributeLimits(2, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1019300, 2894600, 27200, 84200, 45600, 176900, 16200, 116000, 190800, 94000], [906100, 2857900, 20400, 82700, 44700, 170800, 15700, 112000, 184200, 90700], [1], [26], [20], 1);
    // await _LoANFTData.addNFTAttributeLimits(3, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1245900, 2967800, 40800, 87400, 47300, 189100, 17400, 124000, 204000, 100400], [1132600, 2931200, 34000, 85800, 46400, 183000, 16800, 120000, 197400, 97200], [1], [147], [140], 1);
    // await _LoANFTData.addNFTAttributeLimits(4, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1529000, 3059400, 57800, 91300, 49400, 204400, 18800, 134000, 220400, 108500], [1359100, 3004500, 47600, 88900, 48100, 195200, 17900, 128000, 210600, 103700], [1], [1772], [1764], 2);
    // await _LoANFTData.addNFTAttributeLimits(5, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1755500, 3132700, 71400, 94400, 51100, 216600, 19900, 142000, 233600, 115000], [1642300, 3096100, 64600, 92800, 50200, 210500, 19300, 138000, 227000, 111800], [1], [15655], [15646], 2);
    // await _LoANFTData.addNFTAttributeLimits(6, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [1925400, 3187700, 81600, 96700, 52300, 225700, 20700, 148000, 243500, 119900], [1812200, 3151000, 74800, 95200, 51500, 219600, 20200, 144000, 236900, 116600], [1], [135286], [135276], 2);
    // await _LoANFTData.addNFTAttributeLimits(7, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2265200, 3297600, 102000, 101400, 54900, 244000, 22400, 160000, 263200, 129600], [2095300, 3242600, 91800, 99100, 53600, 234900, 21600, 154000, 253300, 124700], [1], [140010], [140000], 2);
    // await _LoANFTData.addNFTAttributeLimits(8, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [2718200, 3444200, 129200, 107600, 58200, 268400, 24600, 176000, 289500, 142600], [2435100, 3352600, 112200, 103700, 56100, 253200, 23200, 166000, 273100, 134500], [1], [150010], [150000], 3);
    // await _LoANFTData.addNFTAttributeLimits(9, 10, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [3397800, 3664000, 170000, 117000, 63300, 305000, 28000, 200000, 329000, 162000], [2831500, 3480800, 136000, 109200, 59100, 274500, 25200, 180000, 296100, 145800], [1], [2228880], [2228811], 4);


    const raffleStartTime = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
    const raffleEndTime = parseInt(new Date().getTime() / 1000 + 60 * 86400 + "");
    const raffleExpireTime = parseInt(new Date().getTime() / 1000 + 70 * 86400 + "");

    const raffleStatus = await raffle._raffle_status();
    if (raffleStatus == 0) {
        console.log(4);
        await raffle.setRaffleInfo(1, raffleStartTime + "", raffleEndTime + "", raffleExpireTime + "");
    }

    console.log(5);

    await capsuleStaking.setCapsuleStakingRule(1, 0, "1000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(2, 0, "2000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(3, 0, "3000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(4, 0, "4000000000000000000000");
    await capsuleStaking.setCapsuleStakingRule(5, 0, "5000000000000000000000");
    console.log(6);

    await capsuleData.addCapsuleSupply(1, [1, 2, 3, 4, 5, 6, 8], [50000, 25500, 14500, 4400, 2200, 1660, 920]);
    await capsuleData.addCapsuleSupply(2, [1, 2, 3], [90750, 49500, 24750]);
    await capsuleData.addCapsuleSupply(3, [4, 5, 6], [7926, 4323, 2161]);
    await capsuleData.addCapsuleSupply(4, [8], [3080]);
    await capsuleData.addCapsuleSupply(5, [9], [100]);
}

main();