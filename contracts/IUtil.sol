// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IUtil {
    function randomNumber(address owner) external returns (uint256);
    function sudoRandom(uint256 randomValue, uint32 slot) external pure returns(uint8);
}