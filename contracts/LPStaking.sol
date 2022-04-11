// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

// import "hardhat/console.sol";


interface IERC20Contract {
    // External ERC20 contract
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address tokenOwner) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract LPStaking is ReentrancyGuard {

    IERC20Contract public _loaToken;
    IERC20Contract public _lpToken;
    address private _admin;

    constructor(address loaContract, address lpContract) payable {
        _admin = msg.sender;
        _loaToken = IERC20Contract(loaContract);
        if(loaContract == lpContract)
            _lpToken = _loaToken;
        else 
            _lpToken = IERC20Contract(lpContract);

        _rewardDistributedLast = block.timestamp;
    }

    address[] public _stakers;
    uint256[] public _withdrawDays;
    uint256[] public _withdrawFee;
    mapping(address => uint256) public _tokenStaked;
    mapping(address => uint256) public _tokenStakedAt;
    mapping(address => uint256) public _tokenRewards;

    uint256 public _rewardDistributedLast;
    uint256 public _rewardPerDay;
    uint256 public _totalLPStaked;

    event Staked(
        address owner,
        uint256 amount
    );

    event Withdrawn(
        address owner,
        uint256 amount,
        uint256 fees
    );

    event RewardClaimed(
        address owner,
        uint256 amount
    );

    function updateAdmin() public {
        require(msg.sender == _admin, "You are not authorized.");
        _admin = msg.sender;
    }

    function update(uint256 rewardPerDay) public {
        require(msg.sender == _admin, "You are not authorized.");
        _rewardPerDay = rewardPerDay;
    }

    function updateWithdrawalFee(uint256[] memory dayList, uint256[] memory fees) public {
        require(msg.sender == _admin, "You are not authorized.");
        require(dayList.length + 1 == fees.length, "Data length is incorrected.");

        for(uint256 i = 0; i < _withdrawDays.length; i++) {
            _withdrawDays.pop();
            _withdrawFee.pop();
        }
        for(uint256 i = 0; i < dayList.length; i++) {
            if(i > 0) {
                require(dayList[i] < dayList[i - 1], "Data provided should be in descending order.");
            }
            _withdrawDays.push(dayList[i]);
            _withdrawFee.push(fees[i]);
        }
        _withdrawFee.push(fees[fees.length - 1]);
    }

    function stake(uint256 amount) public {
        require(_lpToken.balanceOf(msg.sender) >= amount, "Unavailable balance.");

        _lpToken.transferFrom(msg.sender, address(this), amount);

        distributeRewards();

        _totalLPStaked += amount;

        _tokenStaked[msg.sender] = _tokenStaked[address(this)] +  amount;
        _tokenStakedAt[msg.sender] = block.timestamp;
        _stakers.push(msg.sender);

        emit Staked(msg.sender, amount);
    }


     function unstake(uint256 withdrawAmount) public {
        require(_tokenStaked[msg.sender] >= withdrawAmount, "User has not staked given amount.");
        require(withdrawAmount > 0, "Withdraw amount.");

        distributeRewards();

        uint256 daysElapsed = SafeMath.div(block.timestamp - _tokenStakedAt[msg.sender] , 86400);

        uint256 deduction = _withdrawFee[_withdrawFee.length - 1];
        for(uint256 i = 0; i < _withdrawDays.length; i++) {
            if(daysElapsed >= _withdrawDays[i]) {
                deduction = _withdrawFee[i];
                break;
            }
        }

        uint256 amount = withdrawAmount;

        if(deduction > 0) {
            amount -= SafeMath.div(SafeMath.mul(deduction, withdrawAmount), 1000);
        }

        _lpToken.transfer(msg.sender, amount);
        if(_tokenRewards[msg.sender] > 0)
            _loaToken.transfer(msg.sender, _tokenRewards[msg.sender]);

        _totalLPStaked -= withdrawAmount;

        _tokenStaked[msg.sender] = _tokenStaked[msg.sender] - withdrawAmount;
        delete _tokenRewards[msg.sender];
        _tokenStakedAt[msg.sender] = block.timestamp;
        
        if(_tokenStaked[msg.sender] == 0) {
            for(uint256 i = 0; i < _stakers.length; i++) {
                if(_stakers[i] == msg.sender) {
                    _stakers[i] = _stakers[_stakers.length -1];
                    _stakers.pop();
                    break;
                }
            }
            delete _tokenStakedAt[msg.sender];
            delete _tokenStakedAt[msg.sender];
        }

        emit Withdrawn(msg.sender, withdrawAmount, withdrawAmount - amount);
    }

    function claimRewards() public {
        distributeRewards();
        uint256 amount = _tokenRewards[msg.sender];
        require(amount >= 0, "User has no rewards.");
        _loaToken.transfer(msg.sender, amount);

        delete _tokenRewards[msg.sender];
        emit RewardClaimed(msg.sender, amount);
    }

    function distributeRewards() public {
        uint256 currentTime = block.timestamp;
        if(_rewardPerDay > 0 && currentTime - _rewardDistributedLast > 10) {
            if(_stakers.length > 0) {
                uint256 secs = SafeMath.sub(currentTime, _rewardDistributedLast);
                uint256 rewards_to_be_distributed = SafeMath.div(SafeMath.mul(_rewardPerDay, secs), 86400);
                
                uint256 perUnitReward = SafeMath.div (rewards_to_be_distributed, _totalLPStaked);
                for(uint256 i = 0; i < _stakers.length; i++) {
                    uint256 user_rewards = SafeMath.mul(perUnitReward, _tokenStaked[_stakers[i]]);
                    _tokenRewards[_stakers[i]] += user_rewards;
                }
                _rewardDistributedLast = _rewardDistributedLast + secs;
            } else {
                _rewardDistributedLast = currentTime;
            }
        }
    }

    function myRewards() public view returns(uint256, uint256, uint256) {
        if(_tokenStaked[msg.sender] == 0) {
            return (0, _rewardDistributedLast, 0);
        }
        return (_tokenRewards[msg.sender], _rewardDistributedLast, SafeMath.mul(_tokenStaked[msg.sender], SafeMath.div (_rewardPerDay, _totalLPStaked)));
    }


}
