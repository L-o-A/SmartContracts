// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

interface IERC20Contract {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address tokenOwner) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IERC1155Contract {
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getCapsuleLevel(uint256 id) external view returns (uint8);
}

contract LOAnft is ERC1155, Ownable {

    IERC20Contract public _erc20Token;
    IERC1155Contract public _capsuleToken;
    address public _nftMarketAddress;
    address public _fusion_address;
    address private _admin;

    // 0 : unpublished
    // 1 : ready to mint
    // 2 : minted
    // 3 : burned
    mapping(uint256 => uint8) public _nft_status;
    mapping(uint256 => uint8) private _nft_level;
    mapping(uint256 => uint8) private _nft_hero;
    mapping(uint256 => address) private _nft_owner;

    mapping(uint256 => uint64) private _nft_attribute_0;
    mapping(uint256 => uint64) private _nft_attribute_1;
    mapping(uint256 => uint64) private _nft_attribute_2;
    mapping(uint256 => uint64) private _nft_attribute_3;
    mapping(uint256 => uint64) private _nft_attribute_4;
    mapping(uint256 => uint64) private _nft_attribute_5;
    mapping(uint256 => uint64) private _nft_attribute_6;
    mapping(uint256 => uint64) private _nft_attribute_7;
    mapping(uint256 => uint64) private _nft_attribute_8;
    mapping(uint256 => uint64) private _nft_attribute_9;
    mapping(uint256 => uint64) private _nft_attribute_10;
    mapping(uint256 => uint64) private _nft_attribute_11;
    mapping(uint256 => uint64) private _nft_attribute_12;

    mapping(uint8 => uint256[]) private _nft_level_to_ids;

    mapping(uint8 => uint256) public _minting_fee;

    event NFTMinted(
        uint256 indexed itemId,
        uint256 indexed capsuleId,
        address indexed buyer,
        uint256 price
    );

    constructor(address erc20Contract)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _erc20Token = IERC20Contract(erc20Contract);
        _admin = msg.sender;
    }

    function updateAccessAddressAndFees (
        address capsuleContract, 
        address nftMarketAddress,
        address fusion_address,
        uint8[] memory capsuleTypes, 
        uint256[] memory fees) public onlyAdmin{
        _capsuleToken = IERC1155Contract(capsuleContract);
        _nftMarketAddress = nftMarketAddress;
        _fusion_address = fusion_address;

        for(uint8 i = 0; i < capsuleTypes.length; i++) {
            _minting_fee[capsuleTypes[i]] = fees[i];
        }
    }

    // Modifier
    modifier onlyAdmin() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function getNFTDetail(uint256 id) public view returns (uint8, uint8, address, uint8) {
        require(_nft_status[id] == 2, "Id is not minted");

        return (
            _nft_hero[id],
            _nft_level[id],
            _nft_owner[id],
            _nft_status[id]
        );
    }

    function putNFTs(
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory heroes,
        uint256[] memory startTimes
    ) public onlyAdmin {

        require(ids.length ==  levels.length 
        && levels.length == heroes.length 
        && heroes.length == startTimes.length, "Args length not matching");
        
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(_nft_status[ids[i]] == 0, "Id is already published");
        }

        for (uint256 i = 0; i < ids.length; i++) {
            if(_nft_status[ids[i]] == 0)
                _nft_level_to_ids[levels[i]].push(ids[i]);

            _nft_status[ids[i]] = 1;
            _nft_level[ids[i]] = levels[i];
            _nft_hero[ids[i]] = heroes[i];
        }
    }

    function removeNFTs(uint256[] memory ids)public onlyAdmin {
        for (uint256 i = 0; i < ids.length; i++) {
            require(_nft_status[ids[i]] == 0 || _nft_status[ids[i]] == 1, "Id is already consumed.");
        }

        for (uint256 i = 0; i < ids.length; i++) {
            if(_nft_status[ids[i]] == 0) {
                uint256[] storage cids = _nft_level_to_ids[_nft_level[ids[i]]];
                for(uint256 j = 0; j < cids.length; j++) {
                    if(cids[j] == ids[i]) {
                        cids[j] = cids[cids.length -1];
                        cids.pop();
                        break;
                    }
                }
            }
            delete _nft_status[ids[i]];
            delete _nft_level[ids[i]];
            delete _nft_hero[ids[i]];
        }
    }

    function mint(uint256 capsuleId) public payable {

        require(_capsuleToken.balanceOf(msg.sender, capsuleId) > 0, "Capsule is not owned by user");
        uint8 capsuleLevel = _capsuleToken.getCapsuleLevel(capsuleId);

        uint256 id = _nft_level_to_ids[capsuleLevel][_nft_level_to_ids[capsuleLevel].length -1];
        require(_nft_status[id] == 1, "id is not available");

        uint256 fee = _minting_fee[_capsuleToken.getCapsuleLevel(capsuleId)];
        require(_erc20Token.balanceOf(msg.sender) >= fee, "Not enough minting fee available" );

        _nft_owner[id] = msg.sender;
        _nft_status[id] = 2;

        _mint(msg.sender, id, 1, "");

        _capsuleToken.burn(msg.sender, capsuleId);
        
        _nft_level_to_ids[_nft_level[id]].pop();

        _erc20Token.transferFrom(msg.sender, address(this), fee);
        emit NFTMinted(id, capsuleId, msg.sender, 0);
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
            to == _nftMarketAddress ||
            from == _nftMarketAddress, "Not authorized to transfer");

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function withdraw() public onlyAdmin {
        uint256 balance = _erc20Token.balanceOf(address(this));
        require(balance > 0, "Low balance");
        _erc20Token.transfer(msg.sender, balance);
    }

}