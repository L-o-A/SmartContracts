// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

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

/**
 * LPStaking smart contract Liqidity Pool Token or LOA token staking
 * Initialization: call setRewardsPerSecond() function to set rewards for second
 * updateWithdrawalFee() to set withdrawal fees. It accepts values in days[] and fee[]. fee value provided in 1/10th of percentage.
 * stake() to stake Token
 * unstake() to unstake Token
 */
contract LPStaking is ReentrancyGuard {

    IERC20Contract public _loaToken;
    IERC20Contract public _stakeToken;
    address private _admin;

    constructor(address loaContract, address stakeContract) payable {
        _admin = msg.sender;
        _loaToken = IERC20Contract(loaContract);
        if(loaContract == stakeContract)
            _stakeToken = _loaToken;
        else 
            _stakeToken = IERC20Contract(stakeContract);

        _rewardDistributedLast = block.timestamp;
    }

    address[] public _stakers;
    uint256[] public _withdrawDays;
    uint256[] public _withdrawFee;
    mapping(address => uint256) public _tokenStaked;
    mapping(address => uint256) public _tokenStakedAt;

    mapping(address => uint256) public _rewardTallyBefore;
    uint256 public _rewardPerTokenCumulative;

    uint256 public _rewardDistributedLast;
    uint256 public _rewardPerSec;
    uint256 public _totalStakes;

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

    receive() external payable {}

    function updateAdmin() public {
        require(msg.sender == _admin, "You are not authorized.");
        _admin = msg.sender;
    }

    function setRewardsPerSecond(uint256 rewardPerSec) public {
        require(msg.sender == _admin, "You are not authorized.");
        _rewardPerSec = rewardPerSec;
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

    function claimRewards() public {
        require(_tokenStaked[msg.sender] > 0, "User has not staked.");

        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;
        uint256 rewards = SafeMath.mul(_tokenStaked[msg.sender], SafeMath.sub(_rewardPerTokenCumulative, _rewardTallyBefore[msg.sender])) 
                +   SafeMath.div(_rewardPerSec * secs * _tokenStaked[msg.sender], _totalStakes);

        _loaToken.transfer(msg.sender, rewards);

        _rewardPerTokenCumulative = _rewardPerTokenCumulative + SafeMath.div(_rewardPerSec * secs, _totalStakes);
        _rewardDistributedLast = currentTime;

        emit RewardClaimed(msg.sender, rewards);
    }

    function myRewards(address owner) public view returns(uint256, uint256, uint256) {
        if(_tokenStaked[owner] == 0) {
            return (0, _rewardDistributedLast, 0);
        }
        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;
        uint256 rewards = SafeMath.mul(_tokenStaked[msg.sender], SafeMath.sub(_rewardPerTokenCumulative, _rewardTallyBefore[msg.sender])) 
                +   SafeMath.div(_rewardPerSec * secs * _tokenStaked[msg.sender], _totalStakes);
            
        return (rewards, _rewardDistributedLast, SafeMath.div(SafeMath.mul(_tokenStaked[owner], _rewardPerSec), _totalStakes));
    }

    function stake(uint256 amount) public {
        require(_rewardPerSec > 0, "There is no rewards allocated");
        require(_stakeToken.balanceOf(msg.sender) >= amount, "Unavailable balance.");

        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;

        if(_tokenStaked[msg.sender] > 0 ) {
            uint256 rewards = SafeMath.mul(_tokenStaked[msg.sender], SafeMath.sub(_rewardPerTokenCumulative, _rewardTallyBefore[msg.sender])) 
                +   SafeMath.div(_rewardPerSec * secs * _tokenStaked[msg.sender], _totalStakes);
            
            require(_loaToken.transfer(msg.sender, rewards), "Not enough LOA balance available to transfer rewards");
        }

        require(_stakeToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        _tokenStakedAt[msg.sender] = currentTime;
        _totalStakes = SafeMath.add(_totalStakes, amount);
        _tokenStaked[msg.sender] = _tokenStaked[msg.sender] + amount;
        _rewardPerTokenCumulative = _rewardPerTokenCumulative + SafeMath.div(_rewardPerSec * secs, _totalStakes);
        _rewardDistributedLast = currentTime;
        _rewardTallyBefore[msg.sender] = _rewardPerTokenCumulative;
    }

    function unstake(uint256 withdrawAmount) public {
        require(_tokenStaked[msg.sender] >= withdrawAmount, "Unavailable balance.");

        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;

        uint256 daysElapsed = SafeMath.div(currentTime - _tokenStakedAt[msg.sender] , 86400);

        uint256 deduction = _withdrawFee.length > 0 ? _withdrawFee[_withdrawFee.length - 1] : 0;
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

        if(_tokenStaked[msg.sender] > 0 && _rewardPerSec > 0) {
            uint256 rewards = SafeMath.mul(_tokenStaked[msg.sender], SafeMath.sub(_rewardPerTokenCumulative, _rewardTallyBefore[msg.sender])) 
                +   SafeMath.div(_rewardPerSec * secs * _tokenStaked[msg.sender], _totalStakes);
            
            require(_loaToken.transfer(msg.sender, rewards), "Not enough LOA balance available to transfer rewards");
        }

        require(_stakeToken.transfer(msg.sender, amount), "Transfer failed");

        _totalStakes = SafeMath.sub(_totalStakes, withdrawAmount);
        _tokenStaked[msg.sender] = _tokenStaked[msg.sender] - withdrawAmount;
        _rewardPerTokenCumulative = _totalStakes > 0 ? _rewardPerTokenCumulative + SafeMath.div(_rewardPerSec * secs, _totalStakes) : 0;
        _rewardDistributedLast = currentTime;

        if(_tokenStaked[msg.sender] > 0) 
            _rewardTallyBefore[msg.sender] = _rewardPerTokenCumulative;
        else {
            delete _rewardTallyBefore[msg.sender];
            delete _tokenStakedAt[msg.sender];
        }
    }


    function withdraw() public {
        require(_admin == msg.sender, "Only ownder can withdraw");
        uint256 balance = _stakeToken.balanceOf(address(this)) - _totalStakes;
        _stakeToken.transferFrom(address(this), _admin, balance);
        _loaToken.transferFrom(address(this), _admin, _loaToken.balanceOf(address(this)));
    } 

}
