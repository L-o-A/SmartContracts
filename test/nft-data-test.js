const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("RAFFLE ", function () {



  it("RAFFLE Test -5", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();


    const MultiSigAdmin = await ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.deploy();
    await multiSigAdmin.deployed();
    
    const LoANFTData = await ethers.getContractFactory("LoANFTData");
    const _LoANFTData = await LoANFTData.deploy(multiSigAdmin.address);
    await _LoANFTData.deployed();
    
    await _LoANFTData.putNFTAttributeNames(["HASH-POWER", "MAX-HP", "MAX-PRANA", "MAXSPEED", "HP-REGEN", "PRANA-REGEN", "ATTACK-DAMAGE", "ATTACK-SPEED", "CRITICAL-DAMAGE", "ARMOUR", "MAGIC-DEFENCE"]);

    await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5], 
        [759500, 1299400, 108800, 72800], 
        [651000, 1264300, 102400, 71400], 
      [1], [50000], [10000], 1);

    await _LoANFTData.addNFTAttributeLimits(2, 1, [2, 3, 4, 5],
      [759500, 1299400, 108800, 72800],
      [651000, 1264300, 102400, 71400],
      [1], [50000], [10000], 1);

    // await _LoANFTData.populateAttribute(101, 1, 1);
    // await _LoANFTData.populateAttribute(102, 2, 1);
    // console.log("_LoANFTData.populateAttribute(101, 1, 1)");
    // await _LoANFTData.populateAttribute(103, 1, 1);
    // await _LoANFTData.populateAttribute(104, 2, 1);
    // console.log("_LoANFTData.populateAttribute(102, 1, 1)");
    // await _LoANFTData.populateAttribute(105, 1, 1);
    // await _LoANFTData.populateAttribute(106, 2, 1);
    // console.log("_LoANFTData.populateAttribute(103, 1, 1)");


    // console.log(await _LoANFTData.getNFTDetail(101));
    // console.log(await _LoANFTData.getNFTDetail(102));
    // console.log(await _LoANFTData.getNFTDetail(103));



    await _LoANFTData.addNFTSupply(1, [1, 2, 3], [3, 3, 3]);
    await _LoANFTData.addNFTAttributeLimits(1, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    await _LoANFTData.addNFTAttributeLimits(1, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);
    await _LoANFTData.addNFTAttributeLimits(1, 3, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [759500, 1299400, 108800, 72800, 37400, 204100, 31100, 108000, 172300, 91300], [651000, 1264300, 102400, 71400, 36700, 196600, 30200, 104000, 165900, 87900], [1], [50000], [10000], 1);

    let tx = await _LoANFTData.getNewNFTByLevel(1);
    let rc = await tx.wait();
    let event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());
    
    tx = await _LoANFTData.getNewNFTByLevel(1);
    rc = await tx.wait();
    event = rc.events.find(event => event.event === 'Minted');
    console.log(event.args.id.toString(), event.args.hero, event.args.level, event.args._total_supply.toString(), event.args._total_consumed.toString());

  });


});


