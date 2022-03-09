// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "hardhat/console.sol";

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

interface IERC1155Contract {
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getType(uint256 id) external view returns (uint8);
    function isWinner(uint256 id) external view returns (bool);
}

contract Capsule is ERC1155, Ownable {

    IERC1155Contract public _raffleToken;
    address private _admin;
    address private _capsuleStakingAddress;
    address private _loaNFTAddress;
    address private _nftMarketAddress;

    // 0 : unpublished
    // 1 : published
    // 2 : owned
    // 3 : staked
    // 4 : unlocked
    // 5 : minted
    // 6 : burned
    mapping(uint256 => uint8) public _capsule_status;
    mapping(uint256 => uint8) private _capsule_types;
    mapping(uint256 => uint8) private _capsule_level;
    mapping(uint256 => uint256) private _capsule_start_time;
    mapping(uint8 => uint256[]) private _capsule_type_to_ids;

    event CapsuleMinted(
        uint256 indexed itemId,
        address indexed buyer,
        uint256 totalPrice
    );

    constructor() ERC1155("https://capsule.leagueofancients.com/api/capsule/{id}.json") {
        _admin = msg.sender;
    }

    // Modifier
    modifier onlyAdmin() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function setRaffleAddress(address raffleContract) public onlyAdmin{
        _raffleToken = IERC1155Contract(raffleContract);
    }

    function setNFTAddress(address loaNFTAddress, address nftMarketAddress) public onlyAdmin{
        _loaNFTAddress = loaNFTAddress;
        _nftMarketAddress= nftMarketAddress;
    }

    function setCapsuleStakingAddress(address capsuleStakingAddress) public onlyAdmin{
        _capsuleStakingAddress = capsuleStakingAddress;
    }

    function burn(address owner, uint256 id) public payable {
        require(msg.sender == _loaNFTAddress, "You are not authorized to burn");
        _capsule_status[id] = 6;
        _burn(owner, id, 1);
    }

    function getCapsuleType(uint256 id) public view returns (uint8) {
        require(msg.sender == _capsuleStakingAddress, "You are not authorized to call this method");
        return _capsule_types[id];
    }

    function getCapsuleLevel(uint256 id) public view returns (uint8) {
        require(msg.sender == _loaNFTAddress, "You are not authorized to call this method");
        return _capsule_level[id];
    }

    function putCapsules(
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory types,
        uint256[] memory startTimes
    ) public onlyAdmin {

        require(ids.length ==  levels.length && levels.length == types.length && types.length == startTimes.length, "Args length not matching");
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
        }

        for (uint256 i = 0; i < ids.length; i++) {
            if(_capsule_status[ids[i]] == 0) {
                _capsule_type_to_ids[types[i]].push(ids[i]);
            }
            _capsule_status[ids[i]] = 1;
            _capsule_level[ids[i]] = levels[i];
            _capsule_types[ids[i]] = types[i];
            _capsule_start_time[ids[i]] = startTimes[i];
        }
    }

    function removeCapsules(uint256[] memory ids)public onlyAdmin {
        for (uint256 i = 0; i < ids.length; i++) {
            require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
        }

        for (uint256 i = 0; i < ids.length; i++) {
            if(_capsule_status[ids[i]] == 0) {
                uint256[] storage cids = _capsule_type_to_ids[_capsule_types[ids[i]]];
                for(uint256 j = 0; j < cids.length; j++) {
                    if(cids[j] == ids[i]) {
                        cids[j] = cids[cids.length -1];
                        cids.pop();
                        break;
                    }
                }
            }
            delete _capsule_status[ids[i]];
            delete _capsule_level[ids[i]];
            delete _capsule_types[ids[i]];
            delete _capsule_start_time[ids[i]];
        }
    }

    function airdrop(uint8 capsuleType, address dropTo) public payable onlyAdmin {

        require(_capsule_type_to_ids[capsuleType].length > 0, "Capsule not available.");
        uint256 capsuleId = _capsule_type_to_ids[capsuleType][_capsule_type_to_ids[capsuleType].length -1];

        require(_capsule_status[capsuleId] == 1, "Capsule is not available");
        require(_capsule_start_time[capsuleId] < block.timestamp, "Minting hasn't started yet");

        _capsule_status[capsuleId] = 2;
        _mint(dropTo, capsuleId, 1, "");
        
        _capsule_type_to_ids[_capsule_types[capsuleId]].pop();
        emit CapsuleMinted(capsuleId, msg.sender, 0);
    }

    function mintFromTicket(uint256 ticketId) public payable {

        require(_raffleToken.balanceOf(msg.sender, ticketId) > 0, "Ticket doesn't belong to you");
        require(_raffleToken.isWinner(ticketId), "Ticket is not a winner");

        uint8 capsuleType = _raffleToken.getType(ticketId);

        require(_capsule_type_to_ids[capsuleType].length > 0, "Capsule not available.");
        uint256 capsuleId = _capsule_type_to_ids[capsuleType][_capsule_type_to_ids[capsuleType].length -1];

        require(_capsule_status[capsuleId] == 1, "id is not available");
        require(_capsule_start_time[capsuleId] < block.timestamp, "Minting hasn't started yet");

        _capsule_status[capsuleId] = 2;

        _mint(msg.sender, capsuleId, 1, "");
        _raffleToken.burn(msg.sender, ticketId);
        
        _capsule_type_to_ids[_capsule_types[capsuleId]].pop();
        emit CapsuleMinted(capsuleId, msg.sender, 0);
    }

    function markVested(uint256 capsuleId) public  {
        require(_capsuleStakingAddress == msg.sender, "You are not authorized.");
        require(_capsule_status[capsuleId] == 2, "Token is not allocated.");
        _capsule_status[capsuleId] = 3;
    }

    function getCapsuleStatus(uint256 capsuleId) public view returns (uint8)  {
        return _capsule_status[capsuleId];
    }

    function markUnlocked(uint256 capsuleId) public  {
        require(_capsuleStakingAddress == msg.sender, "You are not authorized.");
        require(_capsule_status[capsuleId] == 3, "Token is not vested.");
        _capsule_status[capsuleId] = 4;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(msg.sender == _admin ||
            msg.sender == _nftMarketAddress ||
            to == address(0) ||
            msg.sender == address(this) || 
            to == _capsuleStakingAddress ||
            from == _capsuleStakingAddress ||
            to == _nftMarketAddress ||
            from == _nftMarketAddress, "Not authorized to transfer");

        return super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {

        require(msg.sender == _admin ||
            msg.sender == _nftMarketAddress ||
            to == address(0) ||
            msg.sender == address(this) || 
            to == _capsuleStakingAddress ||
            from == _capsuleStakingAddress ||
            to == _nftMarketAddress ||
            from == _nftMarketAddress, "Not authorized to transfer");

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
