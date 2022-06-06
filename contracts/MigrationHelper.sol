// // SPDX-License-Identifier: MIT OR Apache-2.0
// pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
// // import "hardhat/console.sol";

// interface IERC20Contract {
//     // External ERC20 contract
//     function transfer(address recipient, uint256 amount)
//         external
//         returns (bool);

//     function balanceOf(address tokenOwner) external view returns (uint256);

//     function approve(address spender, uint256 amount) external returns (bool);

//     function transferFrom(
//         address from,
//         address to,
//         uint256 amount
//     ) external returns (bool);
// }

// contract Staking {
//     mapping(address => uint256) public _tokenStaked;
//     mapping(address => uint256) public _tokenStakedAt;

//     mapping(address => uint256) public _rewardTallyBefore;
//     uint256 public _rewardPerTokenCumulative;

//     uint256 public _rewardPerSec;
//     uint256 public _totalStakes;
// }

// /**
//  * LPStaking smart contract Liqidity Pool Token or LOA token staking
//  * Initialization: call setRewardsPerSecond() function to set rewards for second
//  * updateWithdrawalFee() to set withdrawal fees. It accepts values in days[] and fee[]. fee value provided in 1/10th of percentage.
//  * stake() to stake Token
//  * unstake() to unstake Token
//  */
// contract MigrationHelper {

//     IERC20Contract public _loaToken;
//     Staking public _stakingContract;
//     mapping(address=> uint8) private _admins;
//     address private _treasury;
//     uint256  public MULTIPLIER = 1_000_000_000_000;

//     constructor(address loaContract, address treasury, address stakingContract) {
//         _admins[msg.sender] = 1;
//         _stakingContract = Staking(stakingContract);
//         _loaToken = IERC20Contract(loaContract);
//         _treasury = treasury;
//     }

//     mapping(address => uint256) public _rewardTallyBefore;
//     mapping(address => uint8) public _rewardDistributed;
//     uint256 public _rewardPerTokenCumulative;

//     uint256 public _rewardDistributedLast = 1653998400;
//     uint256 public _rewardPerSec;
//     uint256 public _totalStakes;
//     uint256 public _endtime;

//     uint256 private _lastMajorWithdrawReported;
//     uint256 private _lastAmountWithdrawn;
//     bool public _withdrawBlocked;
//     uint256 public _withdrawLimitPercent;

//     modifier validAdmin() {
//         require(_admins[msg.sender] == 1, "You are not authorized.");
//         _;
//     }

//     function modifyAdmin(address adminAddress, bool add) validAdmin public {
//         if(add)
//             _admins[adminAddress] = 1;
//         else {
//             require(adminAddress != msg.sender, "Cant remove self as admin");
//             delete _admins[adminAddress];
//         }
//     }

//     function setRewardsPerSecond(uint256 rewardPerSec) validAdmin public {
//         _rewardPerSec = rewardPerSec;
//     }

//     function setEndTime(uint256 endtime) validAdmin public {
//         _endtime = endtime;
//         _totalStakes = _stakingContract._totalStakes();
//     }

//     function harvest() public {
//         require(_rewardDistributed[msg.sender] == 0, "User has harvested already.");
//         require(_stakingContract._tokenStaked(msg.sender) > 0, "User has not staked.");
//         require(_endtime > 0, "harvest is not enabled.");

//         uint256 currentTime = block.timestamp;
//         if(currentTime > _endtime) {
//             currentTime = _endtime;
//         }

//         uint256 rewards = calcRewards(msg.sender);
//         _loaToken.transfer(msg.sender, rewards);
//         _rewardDistributed[msg.sender] = 1;
//     }

//     function register(address[] memory senders) public {
//         require(_rewardPerSec > 0, "There is no rewards allocated");

//         for(uint256 i = 0 ; i < senders.length; i++) {
//             address sender = senders[i];
//             uint256 timestamp = _stakingContract._tokenStakedAt(sender);

//             if(timestamp == 0)
//                 continue;

//             uint256 currentTime = timestamp;
//             if(currentTime < _rewardDistributedLast) {
//                 currentTime = _rewardDistributedLast;
//             }

//             uint256 secs = currentTime - _rewardDistributedLast;

//             _rewardPerTokenCumulative = _rewardPerTokenCumulative + (_rewardPerSec * secs * MULTIPLIER / _totalStakes);
//             _rewardDistributedLast = currentTime;
//             _rewardTallyBefore[sender] = _rewardPerTokenCumulative;
//         }
//     }

//     function calcRewards(address sender) public view returns (uint256) {
//         if(_stakingContract._tokenStakedAt(sender) == 0)
//             return 0;

//         uint256 endtime = block.timestamp > _endtime ? _endtime : block.timestamp;
//         uint256 secs = 0;
//         if(_rewardDistributedLast < endtime) {
//             secs = endtime - _rewardDistributedLast;
//         }
        
//         if(_stakingContract._tokenStaked(sender) > 0 ) {
//                 uint256 rewards = (_stakingContract._tokenStaked(sender) * (_rewardPerTokenCumulative - _rewardTallyBefore[sender])) / MULTIPLIER
//                     +   (_rewardPerSec * secs * _stakingContract._tokenStaked(sender) / _totalStakes);
//                 return rewards;
//             }
//         return 0;
//     }

//     function extract(address tokenAddress) validAdmin public {
//         if (tokenAddress == address(0)) {
//             payable(_treasury).transfer(address(this).balance);
//             return;
//         }

//         IERC20Contract token = IERC20Contract(tokenAddress);
//         token.transfer(_treasury, token.balanceOf(address(this)));
//     }

// }
