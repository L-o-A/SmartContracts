// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "hardhat/console.sol";

interface IERC20Contract {
    // External ERC20 contract
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address tokenOwner) external view returns (uint256);
}

contract RaffleHelper {

    mapping(address => uint8) _admins;
    uint256[] _raffle_supply_range;
    uint256[] _raffle_price_range;
    address _treasury;

    constructor() {
        _admins[msg.sender] = 1;
    }

     modifier validAdmin() {
        require(_admins[msg.sender] == 1, "You are not authorized.");
        _;
    }

    function modifyAdmin(address adminAddress, bool add) validAdmin public {
        if(add)
            _admins[adminAddress] = 1;
        else {
            require(adminAddress != msg.sender, "Cant remove self as admin");
            delete _admins[adminAddress];
        }
    }

     function setTresury(address treasury) public validAdmin {
        _treasury = treasury;
    }

    //Admin need to add Raffle ticket before it can be bought or minted
    function putRafflePrices(
        uint256[] memory supply,
        uint256[] memory prices
    ) public validAdmin {
        // require(_raffle_status < 2, "Raffle is already closed.");
        require(supply.length + 1 == prices.length, "Data length is incorrected.");

        delete _raffle_supply_range;
        delete _raffle_price_range;

        for(uint256 i = 0; i < supply.length; i++) {
            if(i > 0) {
                require(supply[i] > supply[i - 1], "Data provided should be in ascending order.");
            }
        }

        _raffle_supply_range = supply;
        _raffle_price_range = prices;
    }
    
    function calcPrice(uint32 units, uint256 currentSupply) public view returns (uint256) {

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

    function getCurrentRewards(uint64[] memory _reward_amount, uint256[] memory _reward_range, uint256 _raffle_supply) public pure returns (uint64) {
        uint64 rewards = _reward_amount[_reward_amount.length -1];
        for(uint i = 0; i < _reward_range.length; i++) {
            if(_raffle_supply < _reward_range[i]) {
                rewards = _reward_amount[i];
                break;
            }
        }
        return rewards;
    }

    function extract(address tokenAddress) validAdmin public {
        if (tokenAddress == address(0)) {
            payable(_treasury).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_treasury, token.balanceOf(address(this)));
    }

}