const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("LIVE MP Test ", function () {
    it("LIVE MP Test", async function () {

        const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

        console.log("addr1.address :", addr1.address);
        console.log("addr2.address :", addr2.address);

        // const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce"; //BSC Testnet
        //  const loa = "0xcc631F7362A60213589E84D598F7dDD8630b525b"; //ROSTEN
        const treasury = addr3.address;
        const admin2 = addr3.address;
        const admin3 = addr3.address;

        const multiSigAdmin_addr = null;
        const raffleHelper_addr = null;
        const raffle_addr = null;
        const capsule_addr = null;
        const capsuleData_addr = null;
        const capsuleStaking_addr = null;
        const _LoANFTData_addr = null;
        const _LoANFT_addr = null;
        const _LoANFTFusion_addr = null;
        const _NFTMarket_addr = null;
        const _UTIL_address = null;



        const LOA = await ethers.getContractFactory("MYERC20");
        const loa = await LOA.deploy("LOA", "LOA");
        await loa.deployed();

        await loa.connect(addr1).mint("10000000000000000000000000000");
        await loa.connect(addr2).mint("10000000000000000000000000000");
        console.log("loa.address :", loa.address);

        let multiSigAdmin;
        if (multiSigAdmin_addr != null) {
            const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
            multiSigAdmin = await MultiSigAdmin.attach(multiSigAdmin_addr);
            console.log("multiSigAdmin.address :", multiSigAdmin.address);
        } else {
            const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
            multiSigAdmin = await MultiSigAdmin.deploy();
            await multiSigAdmin.deployed();
            console.log("multiSigAdmin.address :", multiSigAdmin.address);

            // await multiSigAdmin.modifyAdmin(admin2, true);
            // await multiSigAdmin.modifyAdmin(admin3, true);
            await multiSigAdmin.modifyAdmin(treasury, true);
            await multiSigAdmin.setTreasury(treasury);
        }


        let _LOAUtil;
        if (_UTIL_address == null) {
            const LOAUtil = await ethers.getContractFactory("LOAUtil");
            _LOAUtil = await LOAUtil.deploy();
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
            raffleHelper = await RaffleHelper.deploy(multiSigAdmin.address);
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
            raffle = await Raffle.deploy(loa.address, raffleHelper.address, multiSigAdmin.address);
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
            capsule = await Capsule.deploy(multiSigAdmin.address);
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
            capsuleData = await CapsuleData.deploy(multiSigAdmin.address);
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
            capsuleStaking = await CapsuleStaking.deploy(loa.address, multiSigAdmin.address);
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
            _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
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
            _LoANFT = await LoANFT.deploy(loa.address, multiSigAdmin.address, _LoANFTData.address);
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
            _LoANFTFusion = await LoANFTFusion.deploy(loa.address, _LoANFT.address, multiSigAdmin.address);
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
            _NFTMarket = await NFTMarket.deploy(loa.address, multiSigAdmin.address);
            await _NFTMarket.deployed()
            console.log("_NFTMarket.address :", _NFTMarket.address);
        } else {
            const NFTMarket = await ethers.getContractFactory("NFTMarket");
            _NFTMarket = await NFTMarket.attach(_NFTMarket_addr);
            console.log("_NFTMarket.address :", _NFTMarket.address);
        }

        console.log(1);

        await multiSigAdmin.setFusionAddress(_LoANFTFusion.address);
        await multiSigAdmin.setMarketAddress(_NFTMarket.address);
        await multiSigAdmin.setCapsuleAddress(capsule.address);
        await multiSigAdmin.setCapsuleStakingAddress(capsuleStaking.address);
        await multiSigAdmin.setCapsuleDataAddress(capsuleData.address);
        await multiSigAdmin.setNFTDataAddress(_LoANFTData.address);
        await multiSigAdmin.setNFTAddress(_LoANFT.address);
        await multiSigAdmin.setUtilAddress(_LOAUtil.address);

        await multiSigAdmin.modifyRaffleAddress(raffle.address, true);

        await raffleHelper.putRafflePrices([500, 1000, 1500, 2500],
            ["1000000000000000000000", "1100000000000000000000", "1333000000000000000000", "1666000000000000000000", "2000000000000000000000"],
            [100, 200, 300, 400, 500], [500, 1000, 1500, 2500]);


        await raffleHelper.setRaffle(raffle.address);
        console.log(2);

        const twoDaysAgo = parseInt(new Date().getTime() / 1000 - 2 * 86400 + "");
        const tomorrow = parseInt(new Date().getTime() / 1000 + 2 * 86400 + "");
        const future = parseInt(new Date().getTime() / 1000 + 20 * 86400 + "");

        const raffleStatus = await raffle._raffle_status();
        if (raffleStatus == 0) {
            console.log(4);
            await raffle.setRaffleInfo(1, twoDaysAgo + "", tomorrow + "", future + "");
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

        console.log(6.6);
        await loa.connect(addr1).approve(raffle.address, "200000000000000000000000000");
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        await raffle.connect(addr1).buyTicket(150);
        console.log(6.7);

        await loa.connect(addr2).approve(raffle.address, "20000000000000000000000000");
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);
        await raffle.connect(addr2).buyTicket(150);

        console.log(16);

        await raffle.setRaffleInfo(1, 10, 100, 102);


        console.log(17.1);
        await raffle.pickWinner(100);
        console.log(17.2);
        await raffle.pickWinner(100);
        console.log(17.3);
        await raffle.pickWinner(100);
        await raffle.pickWinner(100);

        console.log(18);
        // console.log("getUserWinningTickets 1:", await raffle.connect(addr1).getUserWinningTickets(addr1.address));
        // console.log("getUserWinningTickets 2:", await raffle.connect(addr2).getUserWinningTickets(addr2.address));
        const winn1 = await raffle.connect(addr1).getUserWinningTickets(addr1.address);
        const winn2 = await raffle.connect(addr2).getUserWinningTickets(addr2.address);
        console.log("winn1.length", winn1.length);
        console.log("winn2.length", winn2.length);
        let tickets = [];
        // for (let i = 0; i < winn1.length; i++) {
        // console.log("balanceOf", winn1[i], await raffle.balanceOf(addr1.address, winn1[i]));
        // }
        if (winn1.length >= 100) {
            for (let i = 0; i < 100; i++) {
                tickets.push(winn1[i]);
            }
            console.log("******* claiming by capsule *******");
            await capsule.connect(addr1).claim(tickets, raffle.address, addr1.address);
            console.log("******* claiming by capsule done ******* ");
        }
        const winn11 = await raffle.connect(addr1).getUserWinningTickets(addr1.address);
        console.log("winn11.length", winn11.length);
        console.log("------------------- 1 withdraw --------------------");
        await raffle.connect(addr1).withdraw(loa.address);
        console.log("------------------- 2 withdraw --------------------");
        await raffle.connect(addr2).withdraw(loa.address);
        console.log("------------------- 3 withdraw --------------------");
        return;

    }).timeout(100000);
});


