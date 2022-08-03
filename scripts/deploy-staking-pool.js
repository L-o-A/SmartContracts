const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying Staking Pool...");

    const loa = "0xD0C2eB52D221ADE2897e78264E457777032744ce";
    const gq = "0xf4d2FBBaD7018761284936CD87263158F3deFeBe";
    // const _PartnerStaking_addr = "0xd83b93eBd9c42B14d72A95452E82C625Fff68485"; //in use bsctestnet
    const _PartnerStaking_addr = "0x450Dd58389514eC61EcE69Ee7F9c698EBC2A159c";

    // const _gq = await (await ethers.getContractFactory("MYERC20")).attach(gq);
    // await _gq.mint("5000000000000000000000000");
    // return;

    // const MYERC20 = await ethers.getContractFactory("MYERC20");
    // const _gq = await MYERC20.deploy("GQ", "GQ");
    // await _gq.deployed();
    // console.log("_gq.address :", _gq.address);

    let _PartnerStaking;
    if (_PartnerStaking_addr == null) {
        _PartnerStaking = await (await ethers.getContractFactory("PartnerStaking")).deploy(gq, loa);
        await _PartnerStaking.deployed()
        console.log("_PartnerStaking.address :", _PartnerStaking.address);
    } else {
        _PartnerStaking = await (await ethers.getContractFactory("PartnerStaking")).attach(_PartnerStaking_addr);
        console.log("_PartnerStaking.address :", _PartnerStaking.address);
    }

    //     _PartnerStaking.address : 0xd83b93eBd9c42B14d72A95452E82C625Fff68485
    // _start_time BigNumber { value: "1658908800" }
    // _end_time BigNumber { value: "1658909400" }
    // _interval BigNumber { value: "1658909100" }
    // _max_stake_till_interval BigNumber { value: "1666670000000000000000" }
    // _max_stake BigNumber { value: "5000000000000000000000" }

    // console.log("_start_time", await _PartnerStaking._start_time());
    console.log("_end_time", await _PartnerStaking._end_time());
    // console.log("_interval", await _PartnerStaking._interval());
    // console.log("_max_stake_till_interval", await _PartnerStaking._max_stake_till_interval());
    // console.log("_max_stake", await _PartnerStaking._max_stake());

    // return;

    // console.log(0);
    // await _PartnerStaking.setTresury("0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da");
    // console.log(1);
    // await _PartnerStaking.setRewardsPerSecond("643000000000000000");
    // console.log(2);
    // await _PartnerStaking.updateWithdrawalFee([30],[30, 30]);
    console.log(3);
    await _PartnerStaking.setTimelineLimits("1650815200", "1659088530", "1659010200", "500000000000000000000", "50000000000000000000000");
    console.log(4);

    return;

    // await _PartnerStaking.addAdmin();
    
}

main();
