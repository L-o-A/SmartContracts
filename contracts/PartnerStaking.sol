// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
import "hardhat/console.sol";

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
 * PartnerStaking smart contract Liqidity Pool Token or LOA token staking
 * Initialization: call setRewardsPerSecond() function to set rewards for second
 * updateWithdrawalFee() to set withdrawal fees. It accepts values in days[] and fee[]. fee value provided in 1/10th of percentage.
 * stake() to stake Token
 * unstake() to unstake Token
 */
contract PartnerStaking is ReentrancyGuard {

    IERC20Contract public _loaToken;
    IERC20Contract public _stakeToken;
    mapping(address=> uint8) private _admins;
    address private _treasury;

    constructor(address loaContract, address stakeContract) {
        _admins[msg.sender] = 1;
        _loaToken = IERC20Contract(loaContract);
        if(loaContract == stakeContract)
            _stakeToken = _loaToken;
        else 
            _stakeToken = IERC20Contract(stakeContract);
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
    uint256 public _start_time;
    uint256 public _end_time;
    uint256 public _interval;
    uint256 public _max_stake_till_interval;
    uint256 public _max_stake;

    uint256 private _lastMajorWithdrawReported;
    uint256 private _lastAmountWithdrawn;
    bool public _withdrawBlocked;
    uint256 public _withdrawLimitPercent;
    uint256  public PRECISION_FACTOR = 1_000_000_000_000;


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

    modifier validAdmin() {
        require(_admins[msg.sender] == 1, "You are not authorized.");
        _;
    }

    function addAdmin(address newAdmin) validAdmin public {
        _admins[newAdmin] = 1;
    }

    function removeAdmin(address oldAdmin) validAdmin public {
        delete _admins[oldAdmin];
    }

    function setTresury(address treasury) validAdmin public {
        _treasury = treasury;
    }

    function setRewardsPerSecond(uint256 rewardPerSec) validAdmin public {
        _rewardPerSec = rewardPerSec;
    }

    function setWithdrawConstraints(uint256 withdrawLimitPercent) validAdmin public {
        _withdrawLimitPercent = withdrawLimitPercent;
    }

    function removeWithdrawRestriction() validAdmin public {
        _withdrawBlocked = false;
    }

    function updateWithdrawalFee(uint256[] memory dayList, uint256[] memory fees) validAdmin public {
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

    function setTimelineLimits(uint256 start_time, uint256 end_time, uint256 interval, uint256 max_stake_till_interval, uint max_stake) validAdmin public {
        require(start_time < end_time || end_time == 0, "start_time > end_time");

        _start_time = start_time;
        _end_time = end_time;
        _interval = interval;
        _max_stake = max_stake;
        _max_stake_till_interval = max_stake_till_interval;
    }

    function claimRewards() public {
        require(_tokenStaked[msg.sender] > 0, "User has not staked.");

        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;
        uint256 rewards = _tokenStaked[msg.sender] * (_rewardPerTokenCumulative - _rewardTallyBefore[msg.sender]) / PRECISION_FACTOR 
                +   (_rewardPerSec * secs * _tokenStaked[msg.sender] / _totalStakes);

        _loaToken.transfer(msg.sender, rewards);

        _rewardPerTokenCumulative = _rewardPerTokenCumulative + (_rewardPerSec * secs * PRECISION_FACTOR / _totalStakes);
        _rewardDistributedLast = currentTime;

        _rewardTallyBefore[msg.sender] = _rewardPerTokenCumulative;
        emit RewardClaimed(msg.sender, rewards);
    }

    function myRewards(address owner) public view returns(uint256, uint256, uint256) {
        if(_tokenStaked[owner] == 0) {
            return (0, _rewardDistributedLast, 0);
        }
        uint256 currentTime = block.timestamp;
        console.log("currentTime : ", currentTime);
        uint256 secs = currentTime - _rewardDistributedLast;

        console.log("currentTime secs: ", secs);
        
        uint256 rewards = (_tokenStaked[owner] * (_rewardPerTokenCumulative - _rewardTallyBefore[owner])) / PRECISION_FACTOR
                +   (_rewardPerSec * secs * _tokenStaked[owner] / _totalStakes);
            
        return (rewards, _rewardDistributedLast, ((_tokenStaked[owner]* _rewardPerSec)/ _totalStakes));
    }

    function stake(uint256 amount) public {
        require(_start_time == 0 || block.timestamp > _start_time, "Staking is not live yet");
        require(_end_time == 0 || block.timestamp < _end_time, "Staking is closed");

        require(_rewardPerSec > 0, "There is no rewards allocated");
        require(_stakeToken.balanceOf(msg.sender) >= amount, "Unavailable balance.");

        if(_interval > block.timestamp && _max_stake_till_interval > 0)
            require(_max_stake_till_interval >= amount + _tokenStaked[msg.sender], "Crossing limit");

        if(_interval < block.timestamp && _max_stake > 0)
            require(_max_stake >= amount + _tokenStaked[msg.sender], "Crossing max allowed");

        uint256 currentTime = block.timestamp > _end_time ? _end_time : block.timestamp;

        uint256 secs = _rewardDistributedLast == 0 ? 0 : (currentTime - _rewardDistributedLast);

        if(_tokenStaked[msg.sender] > 0 ) {
            uint256 rewards = (_tokenStaked[msg.sender] * (_rewardPerTokenCumulative - _rewardTallyBefore[msg.sender])) / PRECISION_FACTOR
                +   (_rewardPerSec * secs * _tokenStaked[msg.sender] / _totalStakes);
            
            require(_loaToken.transfer(msg.sender, rewards), "Not enough LOA balance available to transfer rewards");
        }

        require(_stakeToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        _tokenStakedAt[msg.sender] = currentTime;
        _totalStakes = _totalStakes + amount;
        _tokenStaked[msg.sender] = _tokenStaked[msg.sender] + amount;
        _rewardPerTokenCumulative = _rewardPerTokenCumulative + (_rewardPerSec * secs * PRECISION_FACTOR / _totalStakes);
        _rewardDistributedLast = currentTime;
        _rewardTallyBefore[msg.sender] = _rewardPerTokenCumulative;
    }

    function unstake(uint256 withdrawAmount) public {
        require(_tokenStaked[msg.sender] >= withdrawAmount, "Unavailable balance.");

        uint256 secs = block.timestamp - _rewardDistributedLast;
        uint256 tokenStaked = _tokenStaked[msg.sender];
        if(tokenStaked > 0 && _rewardPerSec > 0) {
            uint256 rewards = (tokenStaked * (_rewardPerTokenCumulative- _rewardTallyBefore[msg.sender])) / PRECISION_FACTOR
                +   (_rewardPerSec * secs * tokenStaked/ _totalStakes);
            
            require(_loaToken.transfer(msg.sender, rewards), "Not enough LOA balance available to transfer rewards");
        }

        unstakeWithoutRewards(withdrawAmount);
    }

    function unstakeWithoutRewards(uint256 withdrawAmount) public {
        require(_withdrawBlocked == false, "Withdraw is blocked.");
        require(_tokenStaked[msg.sender] >= withdrawAmount, "Unavailable balance.");

        uint256 currentTime = block.timestamp;
        uint256 secs = currentTime - _rewardDistributedLast;

        uint256 daysElapsed = (currentTime - _tokenStakedAt[msg.sender]) / 86400;

        uint256 deduction = _withdrawFee.length > 0 ? _withdrawFee[_withdrawFee.length - 1] : 0;
        for(uint256 i = 0; i < _withdrawDays.length; i++) {
            if(daysElapsed >= _withdrawDays[i]) {
                deduction = _withdrawFee[i];
                break;
            }
        }

        uint256 amount = withdrawAmount;

        if(deduction > 0 && block.timestamp < _end_time) {
            amount -= ((deduction* withdrawAmount)/ 1000);
        }

        require(_stakeToken.transfer(msg.sender, amount), "Transfer failed");
        //transfer fees to treasury
        if(withdrawAmount - amount > 0) {
            _stakeToken.transfer(_treasury, withdrawAmount - amount);
        }

        _totalStakes = _totalStakes - withdrawAmount;
        _tokenStaked[msg.sender] = _tokenStaked[msg.sender] - withdrawAmount;
        _rewardPerTokenCumulative = _totalStakes > 0 ? (_rewardPerTokenCumulative + (_rewardPerSec * secs * PRECISION_FACTOR / _totalStakes)) : 0;
        _rewardDistributedLast = currentTime;

        if(_tokenStaked[msg.sender] > 0) 
            _rewardTallyBefore[msg.sender] = _rewardPerTokenCumulative;
        else {
            delete _rewardTallyBefore[msg.sender];
            delete _tokenStakedAt[msg.sender];
        }

        // If amount withdrawn in last 1 hr is more than allowed percentage of total stakes then withdraw is blocked.
        if(_lastMajorWithdrawReported < currentTime - 3600) {
            _lastMajorWithdrawReported = currentTime;
            _lastAmountWithdrawn = withdrawAmount;
        } else {
            _lastAmountWithdrawn += withdrawAmount;
        }
        if(_totalStakes > 0 && _withdrawLimitPercent > 0 && (_lastAmountWithdrawn * 10000 / _totalStakes) > _withdrawLimitPercent) {
            _withdrawBlocked = true;
        }
    }


    function withdraw() validAdmin public {
        uint256 balance = _stakeToken.balanceOf(address(this)) - _totalStakes;
        _stakeToken.transfer(_treasury, balance);
        if(_stakeToken != _loaToken)
            _loaToken.transfer(_treasury, _loaToken.balanceOf(address(this)));
    } 

    function extract(address tokenAddress) validAdmin public {
        if (tokenAddress == address(0)) {
            payable(_treasury).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        require(token != _stakeToken && token != _loaToken, "Invalid token address");
        token.transfer(_treasury, token.balanceOf(address(this)));
    }
}
