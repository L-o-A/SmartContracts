

const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Adding Capsules...");
    const loa = await (await ethers.getContractFactory("MYERC20")).attach("0xD0C2eB52D221ADE2897e78264E457777032744ce");

    const user1 = "0xf68DF34af420c751D1c0d0B7F0292E89Fa1Ec3Da";
    const spender = "0x142AdBb712C9e152038B338207b641eb697720CD";

    // console.log(await loa.approve(spender, "50000000000000000000"));
    console.log(await loa.allowance(user1, spender));


    console.log("reclaimed");

    // function increaseAllowance(address spender, uint256 addedValue) public virtual returns(bool) {
    //     address owner = _msgSender();
    //     _approve(owner, spender, allowance(owner, spender) + addedValue);
    //     return true;
    // }
    // function allowance(address owner, address spender) public view virtual override returns(uint256) {
    //     return _allowances[owner][spender];
    // }
}

main();