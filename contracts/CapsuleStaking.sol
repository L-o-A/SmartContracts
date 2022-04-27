// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

// import "hardhat/console.sol";

/**
 * This contract is for Capsule Staking
 * Logic: LOA casules needs to be staked along with LOA tokens to be eligible for revelaing the underneath NFT.
 * User in order to have an NFT, needs to have a capusule. Stake the capsule. Then he can open the capsule via NFT contract to get NFT.
 */

interface IERC1155 {
    
    event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value);

    event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values);

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    event URI(string _value, uint256 indexed _id);

    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;

    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external;

    function balanceOf(address _owner, uint256 _id) external view returns (uint256);

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);

    function setApprovalForAll(address _operator, bool _approved) external;
    
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);

    function getCapsuleStatus(uint256 capsuleId) external view returns (uint8);

    function markVested(uint256 capsuleId) external;

    function markUnlocked(uint256 capsuleId) external;

    function getCapsuleType(uint256 id) external view returns (uint8);
}



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
 * Smart contract for capsule staking
 */
contract CapsuleStaking is ReentrancyGuard, ERC1155Holder {

    IERC20Contract public _loaToken;
    IERC1155 public _capsuleToken;
    address private _admin;

    constructor(address erc20Contract) payable {
        _admin = msg.sender;
        _loaToken = IERC20Contract(erc20Contract);
    }

    mapping(uint256 => uint256) public _capsuleStakedOn; // mapping of a capsule staked on time
    mapping(uint256 => uint256) public _capsuleStakedAmount; // mapping of a capsule staked amount
    mapping(uint256 => address) public _capsuleOwner; // mapping of a capsule staked owner

    mapping(uint8 => uint32) public _capsuleStakeTypeDuration; // mapping of a capsule staked type
    mapping(uint8 => uint256) public _capsuleStakeTypeLOATokens; // mapping of a capsule staked LOA token

    event Staked(
        address owner,
        uint256[] capsuleIds
    );

    event Reclaimed(
        address owner,
        uint256[] capsuleIds
    );

    //update capsule Contract
    function setCapsuleContract(address capsuleContract) public {
        require(msg.sender == _admin, "You are not authorized.");
        _capsuleToken = IERC1155(capsuleContract);
    }

    // set capsule staking rules (duration of stake, amount of LOA to be staked) for each capsule type
    function setCapsuleStakingRule(uint8 capsuleType, uint32 stakingDays, uint256 loaTokens) public {
        require(msg.sender == _admin, "You are not authorized.");
        _capsuleStakeTypeDuration[capsuleType] = stakingDays;
        _capsuleStakeTypeLOATokens[capsuleType] = loaTokens;
    }

    //stake capsule along with LOA tokens
    function stake(uint256[] memory capsuleIds) public {
        require(capsuleIds.length > 0, "Capsule Ids not provided");
        uint256 stakedAmount = 0;
        // console.log("capsuleIds.length :", capsuleIds.length);
        // console.log("_capsuleToken.balanceOf(msg.sender, capsuleIds[i]) :", _capsuleToken.balanceOf(msg.sender, capsuleIds[0]));

        for (uint256 i = 0; i < capsuleIds.length; i++) {
            require(_capsuleToken.balanceOf(msg.sender, capsuleIds[i]) > 0, "Capsule doesnt belong to user");
            require(_capsuleToken.getCapsuleStatus(capsuleIds[i])  == 2, "Capsule not ready for staking.");
            uint8 capsuleType = _capsuleToken.getCapsuleType(capsuleIds[i]);
            stakedAmount += _capsuleStakeTypeLOATokens[capsuleType];
        }

        // console.log("stakedAmount :", stakedAmount);
        // console.log("_loaToken.balanceOf(msg.sender) :", _loaToken.balanceOf(msg.sender));

        require(_loaToken.balanceOf(msg.sender) >= stakedAmount, "Not enough balance available.");
        
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            _capsuleToken.safeTransferFrom(msg.sender, address(this), capsuleIds[i], 1, "0x00");
            _capsuleToken.markVested(capsuleIds[i]);
            _capsuleStakedOn[capsuleIds[i]] = block.timestamp;
            _capsuleOwner[capsuleIds[i]] = msg.sender;
            _capsuleStakedAmount[capsuleIds[i]] = _capsuleStakeTypeLOATokens[_capsuleToken.getCapsuleType(capsuleIds[i])];
        }

        require(_loaToken.transferFrom(msg.sender, address(this), stakedAmount), "LOA staking failed");

        emit Staked(msg.sender, capsuleIds);
    }

    // reclaim my staked capsules once its matures after staking period is over
    function reclaim(uint256[] memory capsuleIds) public {
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            require(_capsuleToken.getCapsuleStatus(capsuleIds[i])  == 3, "Capsule not staked.");
            require(_capsuleOwner[capsuleIds[i]] == msg.sender, "Capsule doesnt belong to user");
            
            uint8 capsuleType = _capsuleToken.getCapsuleType(capsuleIds[i]);
            require((_capsuleStakedOn[capsuleIds[i]] + _capsuleStakeTypeDuration[capsuleType] * 86400) < block.timestamp, "Capsule staking period is not over.");
        }

        uint256 stakedAmount = 0;
        
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            _capsuleToken.safeTransferFrom(address(this), msg.sender, capsuleIds[i], 1, "0x00");
            _capsuleToken.markUnlocked(capsuleIds[i]);

            stakedAmount += _capsuleStakedAmount[capsuleIds[i]];

            delete _capsuleStakedOn[capsuleIds[i]];
            delete _capsuleOwner[capsuleIds[i]];
            delete _capsuleStakedAmount[capsuleIds[i]];
        }

        _loaToken.transfer(msg.sender, stakedAmount);

        emit Reclaimed(msg.sender, capsuleIds);
    }

}
