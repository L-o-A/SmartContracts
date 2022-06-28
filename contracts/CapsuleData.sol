// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./IAdmin.sol";
import "hardhat/console.sol";

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
    mapping(uint8 => uint256[]) _capsule_type_to_ids; // keeps mapping of id list of capsule ids by their type

    mapping(address => uint256[]) _user_holdings;
    mapping(address => mapping(uint256 => uint256)) _user_holdings_id_index_mapping;
    mapping(uint8 => uint256) public _total_locked;
    mapping(uint8 => uint256) public _total_unlocked;

    IAdmin _admin;

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

    function getNewCapsuleIdByType(uint8 capsuleType) public view validCapsule returns (uint256) {
        require(_capsule_type_to_ids[capsuleType].length > 0, "No capsule published");
        return _capsule_type_to_ids[capsuleType][_capsule_type_to_ids[capsuleType].length - 1];
    }

    function hasCapsuleTypeToIds(uint8 kind) public view validCapsule returns (bool) {
        return _capsule_type_to_ids[kind].length > 0;
        
    }

    function deleteCapsuleTypeToIdsLast(uint8 kind) public validCapsule {
        _capsule_type_to_ids[kind].pop();
    }


    /*
     * Put Capsule details which can be minted later.
     * User cant mint a capsule if not added to inventory.
     * It consumes of array of values which provides various attributes of a capsule diffentiated via index.
     */
    function modifyCapsules(
        bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory types
    ) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        if(add) {
            require(ids.length ==  levels.length && levels.length == types.length , "Args length not matching");
            
            for (uint256 i = 0; i < ids.length; i++) {
                require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
                if(_capsule_status[ids[i]] == 0) {
                    _capsule_type_to_ids[types[i]].push(ids[i]);
                }
                _capsule_status[ids[i]] = 1;
                _capsule_level[ids[i]] = levels[i];
                _capsule_types[ids[i]] = types[i];
                _total_locked[types[i]]++;
            }
        } else {

            for (uint256 i = 0; i < ids.length; i++) {
                require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
                if(_capsule_status[ids[i]] == 0) {
                    uint256[] storage cids = _capsule_type_to_ids[_capsule_types[ids[i]]];
                    for(uint256 j = 0; j < cids.length; j++) {
                        if(cids[j] == ids[i]) {
                            cids[j] = cids[cids.length -1];
                            cids.pop();
                            _total_locked[types[i]]--;
                            break;
                        }
                    }
                }
                delete _capsule_status[ids[i]];
                delete _capsule_level[ids[i]];
                delete _capsule_types[ids[i]];
            }
        }
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
}