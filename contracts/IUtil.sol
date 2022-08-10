// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IUtil {
    function random(uint256 limit, uint randNonce) external pure returns (uint32);
    function randomNumber(uint256 nonce) external view returns (uint256);
    function sudoRandom(uint256 randomValue, uint32 slot) external pure returns(uint8);
}