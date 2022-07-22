// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract LOAUtil {

    function random(uint256 limit, uint256 randNonce) public view returns (uint64) {
        if(limit == 0) return 0;
        unchecked {
            return uint64(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % limit);
        }
    }
}