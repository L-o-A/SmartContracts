// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IAdmin.sol";

import "hardhat/console.sol";

contract LoANFTData {

    using Counters for Counters.Counter;
    Counters.Counter private _nftCounter;

    mapping(uint8 => NFTSupply) _nft_level_supply;
    mapping(uint8 => uint256) public _minting_fee;
    mapping(address => uint256[]) _user_holdings;

    string[] public _nft_attribute_names;
    mapping(uint256 => string) _nft_attributes;
    mapping(address => uint8) _axionAddresses; // Axion Contract
    mapping(uint8 => uint256) public _nft_level_to_total_added;
    mapping(uint8 => uint256) public _nft_level_to_total_minted;

    mapping(uint256 => NFT) public _nfts;
    mapping(uint8=> mapping(uint8 => NFTAttribLimit)) _nft_attrib_by_level_hero;

    IAdmin _admin;

    struct NFTSupply {
        mapping(uint8 => uint32) _supply;
        mapping(uint8 => uint32) _consumed;
        uint8[] heroes;
        uint32 _total_supply;
        uint32 _total_consumed;
    }

    struct NFTAttribLimit {
        mapping(uint8 => uint64) _max; 
        mapping(uint8 => uint64) _min;
        uint8[] _attributes;
        uint8[] _default_attributes;
        uint8 _total_attributes;
    }

    struct NFT {
        uint256 id;

        // 0 : unpublished
        // 1 : ready to mint
        // 2 : minted
        // 3 : burned
        uint8 status;
        address owner;
        uint8 level;
        uint8 hero;
        uint64[] attributes;
    }

    event NFTMinted(
        uint256 indexed itemIds,
        uint256 indexed capsuleIds,
        address indexed buyer,
        uint256 price
    );

    constructor(address adminContractAddress) {
        _admin = IAdmin(adminContractAddress);
    }

    function addNFTAttributeLimits(
        uint8 level, 
        uint8 hero, 
        uint8[] memory optionalAttributes, 
        uint64[] memory maxValues, 
        uint64[] memory minValues,
        uint8[] memory defaultAttributes,
        uint64[] memory defaultMaxValues, 
        uint64[] memory defaultMinValues,
        uint8 totalOptionalAttributes) public validAdmin {

        require(maxValues.length ==  minValues.length 
            && maxValues.length == optionalAttributes.length, "Args length not matching");

        require(defaultMaxValues.length ==  defaultMinValues.length 
            && defaultMaxValues.length == defaultAttributes.length, "Args length not matching");

        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];

        for(uint8 i = 0; i < optionalAttributes.length; i++) {
            nftAttribLimit._max[optionalAttributes[i]] = maxValues[i];
            nftAttribLimit._min[optionalAttributes[i]] = minValues[i];
        }
        for(uint8 i = 0; i < defaultAttributes.length; i++) {
            nftAttribLimit._max[defaultAttributes[i]] = defaultMaxValues[i];
            nftAttribLimit._min[defaultAttributes[i]] = defaultMinValues[i];
        }
        nftAttribLimit._default_attributes = defaultAttributes;
        nftAttribLimit._attributes = optionalAttributes;
        nftAttribLimit._total_attributes = totalOptionalAttributes;
    }

    function populateAttribute(uint256 id, uint8 level, uint8 hero) private {
        NFT storage nft = _nfts[id];
        require(nft.status < 2, "NFT is minted");
        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];

        nft.hero = hero;
        nft.level = level;
        nft.status = 2;
        nft.attributes = new uint64[](_nft_attribute_names.length + 1);

        //set default values
        for(uint8 i = 0; i < nftAttribLimit._default_attributes.length; i++) {
            nft.attributes[nftAttribLimit._default_attributes[i]] = nftAttribLimit._min[nftAttribLimit._default_attributes[i]]  + 
               random(nftAttribLimit._max[nftAttribLimit._default_attributes[i]] - nftAttribLimit._min[nftAttribLimit._default_attributes[i]], 0);
        }

        uint8[] memory otherAttributes = randomMultiple(nftAttribLimit._attributes, nftAttribLimit._total_attributes, id);
        for(uint8 i = 0; i < otherAttributes.length; i++) {
            nft.attributes[otherAttributes[i]] = nftAttribLimit._min[otherAttributes[i]] + 
                random(nftAttribLimit._max[otherAttributes[i]] - nftAttribLimit._min[otherAttributes[i]], i);
        }
    }


    function addNFTSupply(uint8 level, uint8[] memory heroes, uint32[] memory supply) public validAdmin {
        require(supply.length ==  heroes.length, "Args length not matching");

        NFTSupply storage nftSupply = _nft_level_supply[level];

        for(uint32 i = 0; i < heroes.length; i++) {
            require(nftSupply._consumed[heroes[i]] < supply[i], "Supply cant be less than consumed");
            nftSupply._supply[heroes[i]] = supply[i];
            nftSupply._total_supply += supply[i];
        }
        nftSupply.heroes = heroes;
    }

    function pickNFTHero(uint8 level) private view returns (uint8) {
        NFTSupply storage nftSupply = _nft_level_supply[level];
        uint32 selected = random(nftSupply._total_supply - nftSupply._total_consumed, _nftCounter.current()) + 1;
        uint32 total = 0;
        for(uint i = 0; i < nftSupply.heroes.length; i ++) {
            if(nftSupply._supply[nftSupply.heroes[i]] - nftSupply._consumed[nftSupply.heroes[i]] + total >= selected) {
                return nftSupply.heroes[i];
            }
            total += nftSupply._supply[nftSupply.heroes[i]] - nftSupply._consumed[nftSupply.heroes[i]];
        }
        require(false, "No nft available");
        return 0;
    }

    function getNewNFTByLevel(uint8 level) private returns (uint256) {
        uint8 hero = pickNFTHero(level);
        NFTSupply storage nftSupply = _nft_level_supply[level];

        require(nftSupply._supply[hero] - nftSupply._consumed[hero] > 0, "No capsule available");

        nftSupply._consumed[hero] +=1;
        nftSupply._total_consumed +=1;

        _nftCounter.increment();
        uint256 id = _nftCounter.current();
        populateAttribute(id, level, hero);
        return id;
    }

    function updateFees(uint8[] memory capsuleTypes, uint256[] memory fees) public validAdmin
    {
        require(capsuleTypes.length == fees.length, "args length must match");
        for (uint8 i = 0; i < capsuleTypes.length; i++) {
            _minting_fee[capsuleTypes[i]] = fees[i];
        }
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function getNFTDetail(uint256 id)
        public
        view
        returns (
            uint8,
            uint8,
            address,
            uint8,
            uint64[] memory
        )
    {
        require(_nfts[id].status == 2, "Id is not minted");
        return (_nfts[id].hero, _nfts[id].level, _nfts[id].owner, _nfts[id].status, _nfts[id].attributes);
    }

    function getUserNFTs(address sender) public view returns (uint256[] memory) {
        return _user_holdings[sender];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        
        for (uint256 j = 0; j < _user_holdings[from].length; j++) {
            if (_user_holdings[from][j] == id) {
                _user_holdings[from][j] = _user_holdings[from][
                    _user_holdings[from].length - 1
                ];
                _user_holdings[from].pop();
                break;
            }
        }
        _user_holdings[to].push(id);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids
    ) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        for(uint256 i =0; i < ids.length; i++){
            uint256 id = ids[i];
            for (uint256 j = 0; j < _user_holdings[from].length; j++) {
                if (_user_holdings[from][j] == id) {
                    _user_holdings[from][j] = _user_holdings[from][
                        _user_holdings[from].length - 1
                    ];
                    _user_holdings[from].pop();
                    break;
                }
            }
            _user_holdings[to].push(id);
        }
    }

    function fusion(
        address owner,
        uint256[] memory ids,
        uint8 fusionLevel
    ) public returns (uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");

        for (uint8 i = 0; i < ids.length; i++) {
            for (uint256 j = 0; j < _user_holdings[owner].length; j++) {
                if (_user_holdings[owner][j] == ids[i]) {
                    _user_holdings[owner][j] = _user_holdings[owner][
                        _user_holdings[owner].length - 1
                    ];
                    _user_holdings[owner].pop();
                    break;
                }
            }
        }

        uint256 id = getNewNFTByLevel(fusionLevel);

        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _nft_level_to_total_minted[fusionLevel]++;

        return id;
    }

    function mint(uint8 capsuleLevel, address owner) public returns (uint256, uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");

        uint256 id = getNewNFTByLevel(capsuleLevel);
        uint256 fee = _minting_fee[capsuleLevel];
       
        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _nft_level_to_total_minted[capsuleLevel]++;

        return (id, fee);
    }

    function modifyAxionAddresses(address axionAddress, bool add) public validAdmin {
        if(add)
            _axionAddresses[axionAddress] = 1;
        else
            delete _axionAddresses[axionAddress];
    }

    function modifyProperty(uint256 id, string memory newProperties) public {
        require(_axionAddresses[msg.sender] == 1, "Not authorized axion contract");
        _nft_attributes[id] = newProperties;
    }

    function getNFTAttributes(uint256 id) public view returns (string memory) {
        require(_admin.isValidMarketPlaceContract(msg.sender), "Not authorized");
        return (_nft_attributes[id]);
    }

    function putNFTAttributeNames (string[] memory nft_attribute_names) public validAdmin {
        _nft_attribute_names = nft_attribute_names;
    }

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

    function randomMultiple(uint8[] memory all, uint8 units, uint randNonce) public view returns (uint8[] memory) {

        uint8[] memory finalList = new uint8[](units);
        uint8 count = 0;
        uint8 nonceIncrementor = 0;

        for(uint8 i = 0; i < units; ) {
            uint32 index = random(uint256(all.length), randNonce + nonceIncrementor++);
            if(all[index] > 0) {
                finalList[count++] = all[index];
                all[index] = 0;
                i++;
            }
        }
        return finalList;
    }

    function random(uint256 limit, uint randNonce) public view returns (uint32) {
        if(limit == 0) return 0;
        return uint32(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, randNonce)))% limit);
    }
}
