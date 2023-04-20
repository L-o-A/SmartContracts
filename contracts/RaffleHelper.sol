// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./IAdmin.sol";
// import "hardhat/console.sol";

interface IERC20Contract {
    // External ERC20 contract
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address tokenOwner) external view returns (uint256);
}


contract RaffleHelper {

    uint256[] _raffle_supply_range;
    uint256[] _raffle_price_range;
    address public _raffle;
    uint64[] public _reward_amount;
    uint256[] public _reward_range;
    IAdmin _admin;

    constructor(address adminContractAddress) {
        _admin = IAdmin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function setRaffle(address raffle) public validAdmin {
        _raffle = raffle;
    }

    //Admin need to add Raffle ticket before it can be bought or minted
    function putRafflePrices(
        uint256[] memory supply,
        uint256[] memory prices,
        uint64[] memory reward_amount,
        uint256[] memory reward_range
        
    ) public validAdmin {
        // require(_raffle_status < 2, "Raffle is already closed.");
        require(supply.length + 1 == prices.length, "Data length is incorrected.");
        require(reward_range.length + 1 == reward_amount.length, "Data length is incorrected.");

        delete _raffle_supply_range;
        delete _raffle_price_range;
        delete _reward_amount;
        delete _reward_range;

        for(uint256 i = 0; i < supply.length; i++) {
            if(i > 0) {
                require(supply[i] > supply[i - 1], "Data provided should be in ascending order.");
            }
        }
        for(uint256 i = 0; i < reward_range.length; i++) {
            if(i > 0) {
                require(reward_range[i] > reward_range[i - 1], "Data provided should be in ascending order.");
            }
        }

        _raffle_supply_range = supply;
        _raffle_price_range = prices;
        _reward_amount = reward_amount;
        _reward_range = reward_range;
    }
    
    function calcPrice(uint32 units, uint256 currentSupply) public view returns (uint256) {

        uint256 supply = currentSupply;
        uint256 remaining = units;
        uint256 amount = 0;
        uint256 price = _raffle_price_range[0];


        for(uint256 i = 0; i < _raffle_supply_range.length; i++) {
            if(remaining > 0){
                if(supply < _raffle_supply_range[i]) {
                    price = _raffle_price_range[i];
                    if(supply + remaining <= _raffle_supply_range[i]) {
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
        return amount;
    }

    function getCurrentRewards(uint256 _raffle_supply) public view returns (uint256) {
        uint256 rewards = _reward_amount[_reward_amount.length -1];
        for(uint i = 0; i < _reward_range.length; i++) {
            if(_raffle_supply < _reward_range[i]) {
                rewards = _reward_amount[i];
                break;
            }
        }
        return rewards < _raffle_supply ? rewards : _raffle_supply;
    }

    function extract(address tokenAddress) validAdmin public {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

}