// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; 
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

interface ILOAUtil {
    function randomNumber(address requestor) external returns (uint256);
}

contract CapsuleData is OwnableUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _capsuleCounter;

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

    // constructor(address adminContractAddress) {
    //     _admin = IAdmin(adminContractAddress);
    // }

    function initialize(address adminContractAddress) initializer public {
        __Ownable_init();
        _admin = IAdmin(adminContractAddress);
    }
    
    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    // Modifier
    modifier validCapsule() {
        require(_admin.getCapsuleAddress() == msg.sender, "You are not authorized.");
        _;
    }

    function getNewCapsuleIdByType(uint8 capsuleType, address owner) public validCapsule returns (uint256) {
        uint8 level = pickCapsuleLevel(capsuleType, owner);
        require(level > 0, "No capsule available");
        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];

        require(capsuleSupply._supply[level] > capsuleSupply._consumed[level], "No capsule available");

        capsuleSupply._consumed[level] +=1;
        capsuleSupply._total_consumed +=1;

        _capsuleCounter.increment();
        uint256 id = _capsuleCounter.current();
        _capsule_status[id] = 2;
        _capsule_level[id] = level;
        _capsule_types[id] = capsuleType; 

        _user_holdings[owner].push(id);
        _user_holdings_id_index_mapping[owner][id] = _user_holdings[owner].length -1;

        return id;
    }

    function addCapsuleSupply(uint8 capsuleType, uint8[] memory levels, uint32[] memory supply) public validAdmin {
        require(supply.length ==  levels.length, "Args length not matching");

        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];

        capsuleSupply._total_supply = 0;
        delete capsuleSupply.levels;

        for(uint32 i = 0; i < levels.length; i++) {
            require(capsuleSupply._consumed[levels[i]] < supply[i], "Supply cant be less than consumed");
            capsuleSupply._supply[levels[i]] = supply[i];
            capsuleSupply._total_supply += supply[i];
        }
        capsuleSupply.levels = levels;
    }

    function pickCapsuleLevel(uint8 capsuleType, address owner) public returns (uint8) {
        CapsuleSupply storage capsuleSupply = _capsule_type_supply[capsuleType];
        uint32 selected = uint32(ILOAUtil(_admin.getUtilAddress()).randomNumber(owner) % (capsuleSupply._total_supply - capsuleSupply._total_consumed)) + 1;

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

    function getUserCapsulesBalance(address owner) public view returns (uint256) {
        return _user_holdings[owner].length;
    }

    function getUserCapsuleByIndex(address owner, uint256 index) public view returns (uint256) {
        return _user_holdings[owner][index];
    }

    function doBurn(uint256 id, address owner) public  validCapsule {
        uint256 idx = _user_holdings_id_index_mapping[owner][id];
        _user_holdings[owner][idx] = _user_holdings[owner][_user_holdings[owner].length - 1];
        delete _user_holdings_id_index_mapping[owner][id];
        _user_holdings_id_index_mapping[owner][_user_holdings[owner][_user_holdings[owner].length - 1]] = idx;
        _user_holdings[owner].pop();
        _capsule_status[id] = 6;
    }

    function doTransfer(uint256 capsuleId, address owner, address dropTo) public  validCapsule {
        uint256 idx = _user_holdings_id_index_mapping[owner][capsuleId];
        _user_holdings[owner][idx] = _user_holdings[owner][_user_holdings[owner].length - 1];
        delete _user_holdings_id_index_mapping[owner][capsuleId];
        _user_holdings_id_index_mapping[owner][_user_holdings[owner][_user_holdings[owner].length - 1]] = idx;
        _user_holdings[owner].pop();

        _user_holdings[dropTo].push(capsuleId);
        _user_holdings_id_index_mapping[dropTo][capsuleId] = _user_holdings[dropTo].length -1;
    }


    function getCapsuleDetail(uint256 id) public view returns (uint8, uint8, uint8, address, uint256, uint256) {
        uint8 level = 0;
        if(_admin.isValidMarketPlaceContract(msg.sender)){
            level = _capsule_level[id];
        }

        (address owner, uint256 endtime, uint256 amount) = ICapsuleStaking(_admin.getCapsuleStakingAddress()).getCapsuleStakeInfo(id);
        return (_capsule_types[id], level, _capsule_status[id], owner, endtime, amount);
    }

    function getCapsuleSupply(uint8 capsuleType) public view returns(uint256, uint256) {
        return (_capsule_type_supply[capsuleType]._total_supply, _capsule_type_supply[capsuleType]._total_consumed);
    }


    function markUnstaked (uint256 capsuleId, bool forced) public  {
        require(_admin.getCapsuleStakingAddress() == msg.sender, "You are not authorized.");
        if(forced)
            _capsule_status[capsuleId] = 2;
        else {
            _capsule_status[capsuleId] = 4;
            _total_unlocked[_capsule_types[capsuleId]]++;
        }
    }

    function markStaked(uint256 capsuleId) public  {
        require(_admin.getCapsuleStakingAddress() == msg.sender, "You are not authorized.");
        require(_capsule_status[capsuleId] == 2, "Token is not allocated.");
        _capsule_status[capsuleId] = 3;
    }

}