// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./IAdmin.sol";

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
    function getNFTDetail(uint256 id) external view returns (uint8, uint8, address, uint8, string memory) ;
    function fusion(address owner, uint256[] memory ids, uint8 fusionLevel, uint256 price) external;
}


contract LoANFTFusion {

    IERC20Contract public _loaToken;
    IERC1155Contract public _nftContract;

    // 0 : unpublished
    // 1 : ready to mint
    // 2 : minted
    // 3 : burned
    mapping(uint256 => uint8) public _nft_status;
    mapping(uint256 => uint8) private _nft_level;
    mapping(uint256 => uint8) private _nft_hero;
    mapping(uint256 => address) private _nft_owner;
    mapping(uint8 => uint256[]) private _nft_level_to_ids;

    mapping(uint256 => uint256) public _fusion_rule_price;
    mapping(uint256 => uint8) public _fusion_rule_result;
    mapping(uint256 => uint8[]) public _fusion_rule_levels;
    IAdmin _admin;
    

    event NFTMinted(
        uint256 indexed itemId,
        uint256 indexed capsuleId,
        address indexed buyer,
        uint256 price
    );

    constructor(address loaContract, address loaNFTContract, address adminContractAddress) {
        _loaToken = IERC20Contract(loaContract);
        _nftContract = IERC1155Contract(loaNFTContract);
        _admin = IAdmin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function createFusionRule(
        uint256 id,
        uint256 price,
        uint8 resultLevel,
        uint8[] memory levelValues
    ) public validAdmin {
        _fusion_rule_price[id]= price;
        _fusion_rule_result[id]= resultLevel;
        _fusion_rule_levels[id]= levelValues;
    }

    function removeFusionRule(uint256 id) public validAdmin {
        delete _fusion_rule_price[id];
        delete _fusion_rule_result[id];
        delete _fusion_rule_levels[id];
    }

    function fusion(uint256 ruleId, uint256[] memory ids) public {
        require(_fusion_rule_price[ruleId] > 0, "Rule not found");
        require(
            _loaToken.balanceOf(msg.sender) >= _fusion_rule_price[ruleId],
            "Required LOA balance is not available."
        );

        uint256 nft_prev_hero = 0;

        for (uint256 i = 0; i < ids.length; i++) {
             (uint8 nft_hero, uint8 nft_level, address nft_owner, uint8 nft_status, ) = _nftContract.getNFTDetail(ids[i]);

            require(msg.sender == nft_owner && nft_status == 2, "Token doesnt belong to sender.");
            require(nft_level == _fusion_rule_levels[ruleId][i], "Level type not matching.");
            require(_nftContract.balanceOf(msg.sender, ids[i]) > 0, "Balance not available.");
            if(i > 0) {
                require(nft_prev_hero == nft_hero, "Hero type not matching.");
            }
            nft_prev_hero = nft_hero;
        }

        _loaToken.transferFrom(msg.sender, _admin.getTreasury(), _fusion_rule_price[ruleId]);
        _nftContract.fusion(msg.sender, ids, _fusion_rule_result[ruleId], _fusion_rule_price[ruleId]);
    }


    function withdraw(address tokenAddress) validAdmin public {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }
        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

}