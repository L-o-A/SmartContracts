// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "contracts/IUtil.sol";
import "contracts/IAdmin.sol";

contract LoANFTData is OwnableUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _nftCounter;

    mapping(uint8 => NFTSupply) public _nft_level_supply;
    mapping(uint8 => uint256) public _minting_fee;
    mapping(address => uint256[]) public _user_holdings;
    mapping(address => mapping(uint256 => uint256)) public _user_holdings_id_index;

    string[] public _nft_attribute_names;

    mapping(uint256 => NFT) _nfts;
    mapping(uint8 => mapping(uint8 => NFTAttribLimit)) _nft_attrib_by_level_hero;
    mapping(uint8 => mapping(uint8 => uint64[][])) _attributes_reserve_by_level_hero;
    uint256 _lastCall;

    address _admin;

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

    error NFTUnavailable(uint8 level, uint32 supply, uint32 consumed, uint32 selected);

    function initialize (address adminContractAddress) public initializer {
        _admin = adminContractAddress;
        _lastCall = block.timestamp;
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
            require(maxValues[i] > minValues[i], "Max <= Min");
            nftAttribLimit._max[optionalAttributes[i]] = maxValues[i];
            nftAttribLimit._min[optionalAttributes[i]] = minValues[i];
        }
        for(uint8 i = 0; i < defaultAttributes.length; i++) {
            require(defaultMaxValues[i] > defaultMinValues[i], "Max <= Min");
            nftAttribLimit._max[defaultAttributes[i]] = defaultMaxValues[i];
            nftAttribLimit._min[defaultAttributes[i]] = defaultMinValues[i];
        }
        nftAttribLimit._default_attributes = defaultAttributes;
        nftAttribLimit._attributes = optionalAttributes;
        nftAttribLimit._total_attributes = totalOptionalAttributes;
    }

    function populateAttribute(uint256 id, uint8 level, uint8 hero, address owner) public {
        NFT storage nft = _nfts[id];

        nft.id = id;
        nft.hero = hero;
        nft.level = level;

        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];
        require(nftAttribLimit._total_attributes > 0, "Attribute not set hero level");

        uint256 randomValue = IUtil(IAdmin(_admin).getUtilAddress()).randomNumber(owner);
        uint8 randomCount = 0;

        uint64[] memory attributes = new uint64[](_nft_attribute_names.length + 1);

        //set default values
        for(uint8 i = 0; i < nftAttribLimit._default_attributes.length; i++) {
            attributes[nftAttribLimit._default_attributes[i]] = nftAttribLimit._min[nftAttribLimit._default_attributes[i]]  + 
            ((nftAttribLimit._max[nftAttribLimit._default_attributes[i]] - nftAttribLimit._min[nftAttribLimit._default_attributes[i]] + 1) * IUtil(IAdmin(_admin).getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100 );
        }

        uint8[] memory otherAttributes = randomSubList(nftAttribLimit._attributes, nftAttribLimit._total_attributes, randomValue, randomCount);
        randomCount += nftAttribLimit._total_attributes;

        for(uint8 i = 0; i < otherAttributes.length; i++) {
            attributes[otherAttributes[i]] = nftAttribLimit._min[otherAttributes[i]] + 
                ((nftAttribLimit._max[otherAttributes[i]] - nftAttribLimit._min[otherAttributes[i]] + 1) * IUtil(IAdmin(_admin).getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100);
        }

        nft.attributes = attributes;
    }

    function getNFTAttrLimit(uint8 level, uint8 hero) public view returns (uint8[] memory, uint8[] memory, uint8) {
        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];
        return (nftAttribLimit._attributes, nftAttribLimit._default_attributes, nftAttribLimit._total_attributes);
    }

    function addNFTSupply(uint8 level, uint8[] memory heroes, uint32[] memory supply) public validAdmin {
        require(supply.length ==  heroes.length, "Args length not matching");

        NFTSupply storage nftSupply = _nft_level_supply[level];
        nftSupply._total_supply = 0;
        delete nftSupply.heroes;

        for(uint32 i = 0; i < heroes.length; i++) {
            require(nftSupply._consumed[heroes[i]] < supply[i], "Consumed cant be less than supply");
            nftSupply._supply[heroes[i]] = supply[i];
            nftSupply._total_supply += supply[i];
        }
        nftSupply.heroes = heroes;
    }

    function getNFTSupply(uint8 level) public view returns (uint32, uint32, uint8[] memory) {
        return (_nft_level_supply[level]._total_supply, _nft_level_supply[level]._total_consumed, _nft_level_supply[level].heroes);
    }

    function pickNFTHero(uint8 level, address owner) public returns (uint8) {
        NFTSupply storage nftSupply = _nft_level_supply[level];
        uint32 selected = uint32( IUtil(IAdmin(_admin).getUtilAddress()).randomNumber(owner) % (nftSupply._total_supply - nftSupply._total_consumed)) + 1;

        uint32 total = 0;
        for(uint i = 0; i < nftSupply.heroes.length; i ++) {
            if(nftSupply._supply[nftSupply.heroes[i]] - nftSupply._consumed[nftSupply.heroes[i]] + total >= selected) {
                return nftSupply.heroes[i];
            }
            total += nftSupply._supply[nftSupply.heroes[i]] - nftSupply._consumed[nftSupply.heroes[i]];
        }
        
        revert NFTUnavailable({
            level: level,
            supply: nftSupply._total_supply,
            consumed: nftSupply._total_consumed,
            selected: selected
        });
    }

    function getNewNFTByLevel(uint8 level, address owner) public returns (uint256) {

        NFTSupply storage nftSupply = _nft_level_supply[level];
        require(nftSupply._total_supply > nftSupply._total_consumed, "Supply error");

        uint8 hero = pickNFTHero(level, owner);
        require(hero > 0, "Hero not found");
        require(nftSupply._supply[hero] > nftSupply._consumed[hero], "No Hero NFT available");

        nftSupply._consumed[hero] +=1;
        nftSupply._total_consumed +=1;

        _nftCounter.increment();
        uint256 id = _nftCounter.current();
        populateAttribute(id, level, hero, owner);
        _nfts[id].status = 2;

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
        require(IAdmin(_admin).isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function getNFTDetail(uint256 id) public view returns (uint256, uint8, address, uint8, uint8, uint64[] memory) {
        require(_nfts[id].status == 2, "Id is not minted");
        return (_nfts[id].id, _nfts[id].status, _nfts[id].owner, _nfts[id].level, _nfts[id].hero, _nfts[id].attributes);
    }

    function getUserNFTsByIndex(address sender, uint256 index) public view returns (uint256) {
        return _user_holdings[sender][index];
    }

    function getUserNFTsBalance(address sender) public view returns (uint256) {
        return _user_holdings[sender].length;
    }

    function doTransferFrom( address from, address to, uint256 id) public {
        require(msg.sender == IAdmin(_admin).getNFTAddress(), "Not authorized to transfer");
        
        uint256 index = _user_holdings_id_index[from][id];
        _user_holdings[from][index] = _user_holdings[from][_user_holdings[from].length -1];
        _user_holdings_id_index[from][_user_holdings[from][_user_holdings[from].length -1]] = index;
        _user_holdings[from].pop();
        delete _user_holdings_id_index[from][id];
        
        _user_holdings[to].push(id);
        _user_holdings_id_index[to][id] = _user_holdings[to].length -1;
    }

    // function doBatchTransfer(address from, address to, uint256[] memory ids) public {
    //     require(msg.sender == IAdmin(_admin).getNFTAddress(), "Not authorized to transfer");
    //     for(uint256 i = 0; i < ids.length; i++){
    //         doTransferFrom(from, to, ids[i]);
    //     }
    // }

    function doFusion(address owner, uint256[] memory ids, uint8 fusionLevel ) public returns (uint256) {
        require(msg.sender == IAdmin(_admin).getNFTAddress(), "Not authorized to transfer");

        for (uint8 i = 0; i < ids.length; i++) {
                uint256 index = _user_holdings_id_index[owner][ids[i]];
            _user_holdings[owner][index] = _user_holdings[owner][_user_holdings[owner].length -1];
            _user_holdings_id_index[owner][_user_holdings[owner][_user_holdings[owner].length -1]] = index;
            _user_holdings[owner].pop();
            delete _user_holdings_id_index[owner][ids[i]];
        }

        uint256 id = getNewNFTByLevel(fusionLevel, owner);

        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _user_holdings_id_index[owner][id] = _user_holdings[owner].length -1;
        _lastCall = block.timestamp;
        return id;
    }

    function doMint(uint8 capsuleType, uint8 capsuleLevel, address owner) public returns (uint256, uint256) {
        require(msg.sender == IAdmin(_admin).getNFTAddress(), "Not authorized to transfer");
        require(capsuleLevel > 0, "Invalid level");

        uint256 id = getNewNFTByLevel(capsuleLevel, owner);
        uint256 fee = _minting_fee[capsuleType];
       
        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _user_holdings_id_index[owner][id] = _user_holdings[owner].length -1;
        _lastCall = block.timestamp;
        return (id, fee);
    }

    function putNFTAttributeNames (string[] memory nft_attribute_names) public validAdmin {
        _nft_attribute_names = nft_attribute_names;
    }

    // function withdraw(address tokenAddress) public validAdmin {
    //     if (tokenAddress == address(0)) {
    //         payable(IAdmin(_admin).getTreasury()).transfer(address(this).balance);
    //         return;
    //     }

    //     ERC20 token = ERC20(tokenAddress);
    //     token.transfer(IAdmin(_admin).getTreasury(), token.balanceOf(address(this)));
    // }

    function randomSubList(uint8[] memory list, uint8 units, uint randomValue, uint8 startCount) public view returns (uint8[] memory) {
        uint8[] memory subList = new uint8[](units);
        uint8 count = 0;
        // uint8 nonceIncrementor = 0;

        for(uint8 i = 0; i < units; ) {
            uint32 index = uint32(IUtil(IAdmin(_admin).getUtilAddress()).sudoRandom(randomValue, startCount++) % list.length);
            if(list[index] > 0) {
                subList[count++] = list[index];
                list[index] = 0;
                i++;
            } else if(list.length > index + 1 && list[index + 1] > 0) {
                subList[count++] = list[index + 1];
                list[index + 1] = 0;
                i++;
            } else if(index >= 1 && list[index - 1] > 0) {
                subList[count++] = list[index - 1];
                list[index - 1] = 0;
                i++;
            }
        }
        return subList;
    }
}
