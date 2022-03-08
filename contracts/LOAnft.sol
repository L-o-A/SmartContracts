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
    function getCapsuleLevel(uint256 id) external view returns (uint8);
}

contract LOAnft is ERC1155, Ownable {

    IERC20Contract public _erc20Token;
    IERC1155Contract public _capsuleToken;
    address private _admin;

    // 0 : unpublished
    // 1 : ready to mint
    // 2 : minted
    // 3 : burned
    mapping(uint256 => uint8) public _nft_status;
    mapping(uint256 => uint8) private _nft_level;
    mapping(uint256 => uint8) private _nft_hero;
    mapping(uint256 => address) private _nft_owner;
    mapping(uint256 => address) private _nft_leased_to;
    mapping(uint256 => uint256) private _nft_leased_endtime;
    mapping(uint256 => uint256) private _nft_start_time;
    mapping(uint8 => uint256[]) private _nft_level_to_ids;

    mapping(uint256 => uint256) public _fusion_rule_price;
    mapping(uint256 => uint8) public _fusion_rule_result;
    mapping(uint256 => uint8[]) public _fusion_rule_levels;

    event NFTMinted(
        uint256 indexed itemId,
        uint256 indexed capsuleId,
        address indexed buyer,
        uint256 price
    );

    event NFTLeased(
        uint256 indexed itemId,
        address indexed leassor,
        uint256 tillTime
    );

    event NFTLeasedEnded(
        uint256 indexed itemId
    );

    constructor(address erc20Contract)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _erc20Token = IERC20Contract(erc20Contract);
        _admin = msg.sender;
    }

    function setCapsuleAddress(address capsuleContract) public onlyAdmin{
        _capsuleToken = IERC1155Contract(capsuleContract);
    }

    // Modifier
    modifier onlyAdmin() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function getNFTDetail(uint256 id) public view returns (uint256, uint8, uint8, address, address, uint256) {
        require(_nft_status[id] == 2, "Id is not minted");

        return (
            id,
            _nft_hero[id],
            _nft_level[id],
            _nft_owner[id],
            _nft_leased_to[id],
            _nft_leased_endtime[id]
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
            _nft_start_time[ids[i]] = startTimes[i];
            // _nft_end_time[ids[i]] = endTimes[i];
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
            delete _nft_start_time[ids[i]];
        }
    }

    function mint(uint256 capsuleId) public payable {

        require(_capsuleToken.balanceOf(msg.sender, capsuleId) > 0, "Capsule is not owned by user");
        uint8 capsuleLevel = _capsuleToken.getCapsuleLevel(capsuleId);

        uint256 id = _nft_level_to_ids[capsuleLevel][_nft_level_to_ids[capsuleLevel].length -1];
        require(_nft_status[id] == 1, "id is not available");
        require(_nft_start_time[id] < block.timestamp, "Minting hasn't started yet");
        _nft_owner[id] = msg.sender;
        _nft_status[id] = 2;

        _mint(msg.sender, id, 1, "");

        _capsuleToken.burn(msg.sender, capsuleId);
        
        _nft_level_to_ids[_nft_level[id]].pop();
        emit NFTMinted(id, capsuleId, msg.sender, 0);
    }

    function withdraw() public onlyAdmin {
        uint256 balance = _erc20Token.balanceOf(address(this));
        require(balance > 0, "Low balance");
        _erc20Token.transfer(msg.sender, balance);
    }

    function createFusionRule(
        uint256 id,
        uint256 price,
        uint8 resultLevel,
        uint8[] memory levelValues
    ) public onlyAdmin {
        // require(price > 0, "Price cant be Zero");
        // require(resultLevel > 0, "Result Type Id not provided");

        _fusion_rule_price[id]= price;
        _fusion_rule_result[id]= resultLevel;
        _fusion_rule_levels[id]= levelValues;
    }

    function removeFusionRule(uint256 id) public onlyAdmin {
        delete _fusion_rule_price[id];
        delete _fusion_rule_result[id];
        delete _fusion_rule_levels[id];
    }

    function fusion(uint256 ruleId, uint256[] memory ids) public {
        require(_fusion_rule_price[ruleId] > 0, "Rule not found");
        require(
            _erc20Token.balanceOf(msg.sender) >= _fusion_rule_price[ruleId],
            "Required LOA balance is not available."
        );

        for (uint256 i = 0; i < ids.length; i++) {
            require(msg.sender == _nft_owner[ids[i]] && _nft_status[ids[i]] == 2, "Token doesnt belong to sender.");
            require(_nft_level[ids[i]] == _fusion_rule_levels[ruleId][i], "Level type not matching.");
            if(i > 0) {
                require(_nft_hero[ids[i-1]] == _nft_hero[ids[i]], "Hero type not matching.");
            }
        }

        _erc20Token.transferFrom(msg.sender, address(this), _fusion_rule_price[ruleId]);

        //Burn NFTs
        for (uint256 i = 0; i < ids.length; i++) {
            _burn(msg.sender, ids[i], 1);
            _nft_status[ids[i]] = 3;
            delete _nft_owner[ids[i]];
        }

        uint256 nextId = _nft_level_to_ids[_fusion_rule_result[ruleId]][_nft_level_to_ids[_fusion_rule_result[ruleId]].length - 1];
        _nft_level_to_ids[_fusion_rule_result[ruleId]].pop();

        _nft_hero[nextId] = _nft_hero[ids[0]];
        _nft_level[nextId] = _fusion_rule_result[ruleId];
        _nft_status[nextId] = 2;
        _nft_owner[nextId] = msg.sender;
        _mint(msg.sender, nextId, 1, "");

        emit NFTMinted(nextId, 0, msg.sender, _fusion_rule_price[ruleId]);
    }

}