// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "hardhat/console.sol";

contract LOA_LP_Token is ERC20, ERC20Burnable {

    address private _admin;
    address private _minter;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    constructor() ERC20("LoA LP Token", "LoALP") {
        _admin = msg.sender;
    }

    function addMinter(address minter) public {
        require(_admin == msg.sender, "Not authorized");
        _minter = minter;
    }

    function mint(address to, uint256 amount) public {
        require(_minter == msg.sender, "Not authorized");
        _mint(to, amount);
    }

}