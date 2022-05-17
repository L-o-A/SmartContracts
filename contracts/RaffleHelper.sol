// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "hardhat/console.sol";

contract RaffleHelper {
    
    function calcPrice(uint32 units, uint256 currentSupply, uint256[] memory _raffle_supply_range, uint256[] memory _raffle_price_range) public pure returns (uint256) {
        uint256 supply = currentSupply;
        uint256 remaining = units;
        uint256 amount = 0;
        uint256 price = _raffle_price_range[0];


        for(uint256 i = 0; i < _raffle_supply_range.length; i++) {
            if(remaining > 0){
                price = _raffle_price_range[i];
                if(supply >= _raffle_supply_range[i]) {
                    price = _raffle_price_range[i];
                } else {
                    if(supply + remaining < _raffle_supply_range[i]) {
                        amount += price * remaining;
                        remaining = 0;
                        break;
                    } else {
                        amount += price * (_raffle_supply_range[i] - supply);
                        remaining = remaining - (_raffle_supply_range[i] - supply);
                        supply = _raffle_supply_range[i];
                    }
                }
            }
        }
        if(remaining > 0) {
            price = _raffle_price_range.length > 0 ? _raffle_price_range[_raffle_price_range.length - 1] : 0;
            amount += price * remaining;
        }
        // console.log(amount);
        return amount;
    }

    function random(uint256 limit) public view returns (uint16) {
        return uint16(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, limit)))% limit);
    }

}