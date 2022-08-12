// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract LOAUtil {

    function random(uint256 limit, uint256 randNonce) public view returns (uint64) {
        if(limit == 0) return 0;
        unchecked {
            return uint64(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % limit);
        }
    }

    function randomNumber(uint256 nonce) public view returns (uint256) {
        unchecked {
            uint256 num = uint256(keccak256(abi.encodePacked(block.timestamp + nonce, msg.sender, block.difficulty)));
            if(num < 1_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000) {
                num = uint256(num * num);
            }
            return num;
        }
    }

    function sudoRandom(uint256 randomValue, uint32 slot) public pure returns(uint8) {
        unchecked {
            slot = slot % 31;
            return uint8(randomValue % (100 ** (slot + 1)) / (100 ** slot));
        }
    }
}
