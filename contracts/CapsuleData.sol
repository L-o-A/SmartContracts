// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./IAdmin.sol";
// import "hardhat/console.sol";

interface ICapsuleStaking {
    function getCapsuleStakeInfo(uint256 id) external view returns (address, uint256, uint256);
}

interface IERC20Contract {
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

contract CapsuleData {

    using Counters for Counters.Counter;
    Counters.Counter private _capsuleCounter;

    /**
     * Status values
     */
    // 0 : unpublished
    // 1 : published
    // 2 : owned
    // 3 : staked
    // 4 : unlocked
    // 5 : minted
    // 6 : burned
    mapping(uint256 => uint8) public _capsule_status; //keeps mapping of status of each capsule
    mapping(uint256 => uint8) public _capsule_types; //keeps mapping of type value of each capsule. It is defined while adding data
    mapping(uint256 => uint8) _capsule_level; // keeps mapping of level of each capsule

    mapping(address => uint256[]) _user_holdings;
    mapping(address => mapping(uint256 => uint256)) _user_holdings_id_index_mapping;
    mapping(uint8 => uint256) public _total_locked;
    mapping(uint8 => uint256) public _total_unlocked;
    mapping(uint8 => CapsuleSupply) _capsule_type_supply;

    IAdmin _admin;

    struct CapsuleSupply {
        mapping(uint8 => uint32) _supply;
        mapping(uint8 => uint32) _consumed;
        uint8[] levels;
        uint32 _total_supply;
        uint32 _total_consumed;
    }

    constructor(address adminContractAddress) {
        _admin = IAdmin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    modifier validCapsule() {
        require(_admin.getCapsuleAddress() == msg.sender, "You are not authorized.");
        _;
    }

    function getCapsuleStatus(uint256 id) public view validCapsule returns (uint8) {
        return _capsule_status[id];
    }

    function setCapsuleStatus(uint256 id, uint8 val) public validCapsule {
        _capsule_status[id] = val;
    }

    function getCapsuleLevel(uint256 id) public view validCapsule returns (uint8) {
        return _capsule_level[id];
    }

    function setCapsuleLevel(uint256 id, uint8 val) public validCapsule {
        _capsule_level[id] = val;
    }

    function getCapsuleType(uint256 id) public view validCapsule returns (uint8) {
        return _capsule_types[id];
    }

    function setCapsuleType(uint256 id, uint8 val) public validCapsule {
        _capsule_types[id] = val;
    }

    function getNewCapsuleIdByType(uint8 capsuleType) public validCapsule returns (uint256) {
        uint8 level = pickCapsuleLevel(capsuleType);
        require(level > 0, "No capsule available");
        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];

        require(capsuleSupply._supply[level] - capsuleSupply._consumed[level] > 0, "No capsule available");

        capsuleSupply._consumed[level] +=1;
        capsuleSupply._total_consumed +=1;

        _capsuleCounter.increment();
        uint256 id = _capsuleCounter.current();
        _capsule_status[id] = 2;
        _capsule_level[id] = level;
        _capsule_types[id] = capsuleType; 

        return id;
    }

    function hasCapsuleTypeToIds(uint8 capsuleType) public view validCapsule returns (bool) {
        uint8 level = pickCapsuleLevel(capsuleType);
        CapsuleSupply storage capsuleSupply = _capsule_type_supply[level];
        return capsuleSupply._total_supply - capsuleSupply._total_consumed > 0;
    }

    function addCapsuleSupply(uint8 capsuleType, uint8[] memory levels, uint32[] memory supply) public {
        require(supply.length ==  levels.length, "Args length not matching");

        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];

        for(uint32 i = 0; i < levels.length; i++) {
            require(capsuleSupply._consumed[levels[i]] < supply[i], "Supply cant be less than consumed");
            capsuleSupply._supply[levels[i]] = supply[i];
            capsuleSupply._total_supply += supply[i];
        }
        capsuleSupply.levels = levels;
    }

    function pickCapsuleLevel(uint8 capsuleType) public view returns (uint8) {
        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];
        uint32 selected = random(capsuleSupply._total_supply - capsuleSupply._total_consumed, _capsuleCounter.current()) + 1;
        uint32 total = 0;
        for(uint i = 0; i < capsuleSupply.levels.length; i ++) {
            if(capsuleSupply._supply[capsuleSupply.levels[i]] - capsuleSupply._consumed[capsuleSupply.levels[i]] + total >= selected) {
                return capsuleSupply.levels[i];
            }
            total += capsuleSupply._supply[capsuleSupply.levels[i]] - capsuleSupply._consumed[capsuleSupply.levels[i]];
        }
        return 0;
    }

    function extract(address tokenAddress) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");

        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }
        IERC20Contract token = IERC20Contract(tokenAddress);
        require(token.balanceOf(address(this)) > 0, "No balance available");
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

    function getUserCapsules(address owner) public view returns (uint256[] memory) {
        return _user_holdings[owner];
    }

    function burn(uint256 id, address owner) public  validCapsule {
        uint256 idx = _user_holdings_id_index_mapping[owner][id];
        _user_holdings[owner][idx] = _user_holdings[owner][_user_holdings[owner].length - 1];
        delete _user_holdings_id_index_mapping[owner][id];
        _user_holdings_id_index_mapping[owner][_user_holdings[owner][_user_holdings[owner].length - 1]] = idx;
        _user_holdings[owner].pop();
    }

    function airdrop(uint256 capsuleId, address dropTo) public  validCapsule {
        _user_holdings[dropTo].push(capsuleId);
        _user_holdings_id_index_mapping[dropTo][capsuleId] = _user_holdings[dropTo].length -1;
        _total_unlocked[_capsule_types[capsuleId]]++;
    }


    function getCapsuleDetail(uint256 id) public view returns (uint8, uint8, uint8, address, uint256, uint256) {
        uint8 level = 0;
        if(_admin.isValidMarketPlaceContract(msg.sender)){
            level = _capsule_level[id];
        }

        (address owner, uint256 endtime, uint256 amount) = ICapsuleStaking(_admin.getCapsuleStakingAddress()).getCapsuleStakeInfo(id);
        return (_capsule_types[id], level, _capsule_status[id], owner, endtime, amount);
    }

    function getCapsuleSupply(uint8 capsuleType) public view validAdmin returns(uint256, uint256) {
        return (_capsule_type_supply[capsuleType]._total_supply, _capsule_type_supply[capsuleType]._total_consumed);
    }


    function markStatus(uint256 capsuleId, bool vested, bool unlocked, bool unstaked) public  {
        require(_admin.getCapsuleStakingAddress() == msg.sender, "You are not authorized.");
        if(vested) {
            require(_capsule_status[capsuleId] == 2, "Token is not allocated.");
            _capsule_status[capsuleId] = 3;
        }
        else if(unlocked) {
            require(_capsule_status[capsuleId] == 3, "Token is not vested.");
            _capsule_status[capsuleId] = 4;
        }
        else if(unstaked) {
            require(_capsule_status[capsuleId] == 3, "Token is not vested.");
            _capsule_status[capsuleId] = 2;
        }
    }


    function random(uint256 limit, uint randNonce) public view returns (uint32) {
        require(limit > 0, "Divide by zero");
        return uint32(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, randNonce)))% limit);
    }
}