// Sources flattened with hardhat v2.9.6 https://hardhat.org

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v4.6.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v4.6.0


// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File @openzeppelin/contracts/utils/Context.sol@v4.6.0


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @openzeppelin/contracts/token/ERC20/ERC20.sol@v4.6.0


// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;



// File @openzeppelin/contracts/utils/Counters.sol@v4.6.0


// OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)

pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}


// File contracts/IAdmin.sol


pragma solidity ^0.8.7;

interface IAdmin {
    function isValidAdmin(address adminAddress) external pure returns (bool);
    function getTreasury() external view returns (address);
    function isValidRaffleAddress(address addr) external view returns (bool);
    function isValidCapsuleTransfer(address sender, address from, address to) external view returns (bool);
    function isValidMarketPlaceContract(address sender) external view returns (bool);
    function getCapsuleAddress() external view returns (address);
    function getCapsuleStakingAddress() external view returns (address) ;
    function getCapsuleDataAddress() external view returns (address);
    function getNFTAddress() external view returns (address) ;
    function getMarketAddress() external view returns (address);
    function getNFTDataAddress() external view returns (address);
    function getFusionAddress() external view returns (address);
    function getAxionAddress() external view returns (address);
    function getUtilAddress() external view returns (address);
    function random(uint256 limit, uint randNonce) external view returns (uint32);
}


// File contracts/IUtil.sol


pragma solidity ^0.8.7;

interface IUtil {
    function random(uint256 limit, uint randNonce) external pure returns (uint32);
    function randomNumber(uint256 nonce) external view returns (uint256);
    function sudoRandom(uint256 randomValue, uint32 slot) external pure returns(uint8);
}


// File contracts/LoANFTData.sol


pragma solidity ^0.8.7;



// import "hardhat/console.sol";

contract LoANFTData {

    using Counters for Counters.Counter;
    Counters.Counter private _nftCounter;

    mapping(uint8 => NFTSupply) public _nft_level_supply;
    mapping(uint8 => uint256) public _minting_fee;
    mapping(address => uint256[]) public _user_holdings;
    mapping(address => mapping(uint256 => uint256)) public _user_holdings_id_index;

    string[] public _nft_attribute_names;

    mapping(uint256 => NFT) _nfts;
    mapping(uint8 => mapping(uint8 => NFTAttribLimit)) _nft_attrib_by_level_hero;
    mapping(uint8 => mapping(uint8 => uint64[][])) _attributes_reserve_by_level_hero;
    uint256 _lastCall;

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

    error NFTUnavailable(uint8 level, uint32 supply, uint32 consumed, uint32 selected);

    // constructor(address adminContractAddress) {
    //     _admin = IAdmin(adminContractAddress);
    //     _lastCall = block.timestamp;
    // }

    // Proxy initialization method
    function init(address adminContractAddress) public {
        require(_admin == IAdmin(address(0)), "Already initialized");
        _admin = IAdmin(adminContractAddress);
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
            require(maxValues[i] > minValues[i], "Max < Min");
            nftAttribLimit._max[optionalAttributes[i]] = maxValues[i];
            nftAttribLimit._min[optionalAttributes[i]] = minValues[i];
        }
        for(uint8 i = 0; i < defaultAttributes.length; i++) {
            require(defaultMaxValues[i] > defaultMinValues[i], "Max < Min");
            nftAttribLimit._max[defaultAttributes[i]] = defaultMaxValues[i];
            nftAttribLimit._min[defaultAttributes[i]] = defaultMinValues[i];
        }
        nftAttribLimit._default_attributes = defaultAttributes;
        nftAttribLimit._attributes = optionalAttributes;
        nftAttribLimit._total_attributes = totalOptionalAttributes;
    }

    function populateAttribute(uint256 id, uint8 level, uint8 hero) private {
        NFT storage nft = _nfts[id];

        nft.id = id;
        nft.hero = hero;
        nft.level = level;

        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];
        require(nftAttribLimit._total_attributes > 0, "Attribute not set hero level");

        uint256 randomValue = IUtil(_admin.getUtilAddress()).randomNumber(id);
        uint8 randomCount = 0;

        uint64[] memory attributes = new uint64[](_nft_attribute_names.length + 1);

        //set default values
        for(uint8 i = 0; i < nftAttribLimit._default_attributes.length; i++) {
            attributes[nftAttribLimit._default_attributes[i]] = nftAttribLimit._min[nftAttribLimit._default_attributes[i]]  + 
            ((nftAttribLimit._max[nftAttribLimit._default_attributes[i]] - nftAttribLimit._min[nftAttribLimit._default_attributes[i]]) * IUtil(_admin.getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100 );
        }

        uint8[] memory otherAttributes = randomSubList(nftAttribLimit._attributes, nftAttribLimit._total_attributes, randomValue, randomCount);
        randomCount += nftAttribLimit._total_attributes;

        for(uint8 i = 0; i < otherAttributes.length; i++) {
            attributes[otherAttributes[i]] = nftAttribLimit._min[otherAttributes[i]] + 
                ((nftAttribLimit._max[otherAttributes[i]] - nftAttribLimit._min[otherAttributes[i]]) * IUtil(_admin.getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100);
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
            require(nftSupply._consumed[heroes[i]] < supply[i], "Supply cant be less than consumed");
            nftSupply._supply[heroes[i]] = supply[i];
            nftSupply._total_supply += supply[i];
        }
        nftSupply.heroes = heroes;
    }

    function getNFTSupply(uint8 level) public view returns (uint32, uint32, uint8[] memory) {
        return (_nft_level_supply[level]._total_supply, _nft_level_supply[level]._total_consumed, _nft_level_supply[level].heroes);
    }

    function pickNFTHero(uint8 level) private view returns (uint8) {
        NFTSupply storage nftSupply = _nft_level_supply[level];
        uint32 selected = uint32(_admin.random(nftSupply._total_supply - nftSupply._total_consumed, _nftCounter.current())) + 1;
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

    function getNewNFTByLevel(uint8 level) private returns (uint256) {

        NFTSupply storage nftSupply = _nft_level_supply[level];
        require(nftSupply._total_supply - nftSupply._total_consumed > 0, "Supply error");

        uint8 hero = pickNFTHero(level);
        require(hero > 0, "Hero not found");
        require(nftSupply._supply[hero] - nftSupply._consumed[hero] > 0, "No Hero NFT available");

        nftSupply._consumed[hero] +=1;
        nftSupply._total_consumed +=1;

        _nftCounter.increment();
        uint256 id = _nftCounter.current();
        populateAttribute(id, level, hero);
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
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function getNFTDetail(uint256 id) public view returns (uint256, uint8, address, uint8, uint8, uint64[] memory) {
        require(_nfts[id].status == 2, "Id is not minted");
        return (_nfts[id].id, _nfts[id].status, _nfts[id].owner, _nfts[id].level, _nfts[id].hero, _nfts[id].attributes);
    }

    function getUserNFTs(address sender) public view returns (uint256[] memory) {
        return _user_holdings[sender];
    }

    function doTransferFrom( address from, address to, uint256 id) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        
        uint256 index = _user_holdings_id_index[from][id];
        _user_holdings[from][index] = _user_holdings[from][_user_holdings[from].length -1];
        _user_holdings_id_index[from][_user_holdings[from][_user_holdings[from].length -1]] = index;
        _user_holdings[from].pop();
        delete _user_holdings_id_index[from][id];
        
        _user_holdings[to].push(id);
        _user_holdings_id_index[to][id] = _user_holdings[to].length -1;
    }

    function doBatchTransfer(address from, address to, uint256[] memory ids) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        for(uint256 i = 0; i < ids.length; i++){
            doTransferFrom(from, to, ids[i]);
        }
    }

    function doFusion(address owner, uint256[] memory ids, uint8 fusionLevel ) public returns (uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");

        for (uint8 i = 0; i < ids.length; i++) {
                uint256 index = _user_holdings_id_index[owner][ids[i]];
            _user_holdings[owner][index] = _user_holdings[owner][_user_holdings[owner].length -1];
            _user_holdings_id_index[owner][_user_holdings[owner][_user_holdings[owner].length -1]] = index;
            _user_holdings[owner].pop();
            delete _user_holdings_id_index[owner][ids[i]];
        }

        uint256 id = getNewNFTByLevel(fusionLevel);

        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _user_holdings_id_index[owner][id] = _user_holdings[owner].length -1;
        _lastCall = block.timestamp;
        return id;
    }

    function doMint(uint8 capsuleType, uint8 capsuleLevel, address owner) public returns (uint256, uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        require(capsuleLevel > 0, "Invalid level");

        uint256 id = getNewNFTByLevel(capsuleLevel);
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

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20 token = IERC20(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

    function randomSubList(uint8[] memory list, uint8 units, uint randomValue, uint8 startCount) public view returns (uint8[] memory) {
        uint8[] memory subList = new uint8[](units);
        uint8 count = 0;

        for(uint8 i = 0; i < units; ) {
            uint32 index = uint32(IUtil(_admin.getUtilAddress()).sudoRandom(randomValue, startCount++) % list.length);
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
