// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MYERC20 is ERC20 {

    address private _admin;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1_000_000_000_000_000_000_000_000);
        _admin = msg.sender;
    }

    function mint (uint256 amount) public {
        require(balanceOf(msg.sender) < 1_000_000_000_000_000_000_000_000, "You have enough tokens.");
        _mint(msg.sender, amount);
    }
}