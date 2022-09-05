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



/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}


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
}


// File contracts/IUtil.sol


pragma solidity ^0.8.7;

interface IUtil {
    function random(uint256 limit, uint randNonce) external returns (uint32);
    function randomNumber(address requestor) external returns (uint256);
    function sudoRandom(uint256 randomValue, uint32 slot) external returns(uint8);
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

    function init(address adminContractAddress) public {
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

    function populateAttribute(uint256 id, uint8 level, uint8 hero, address owner) public {
        NFT storage nft = _nfts[id];

        nft.id = id;
        nft.hero = hero;
        nft.level = level;

        NFTAttribLimit storage nftAttribLimit = _nft_attrib_by_level_hero[level][hero];
        require(nftAttribLimit._total_attributes > 0, "Attribute not set hero level");

        uint256 randomValue = IUtil(_admin.getUtilAddress()).randomNumber(owner);
        uint8 randomCount = 0;

        uint64[] memory attributes = new uint64[](_nft_attribute_names.length + 1);

        //set default values
        for(uint8 i = 0; i < nftAttribLimit._default_attributes.length; i++) {
            attributes[nftAttribLimit._default_attributes[i]] = nftAttribLimit._min[nftAttribLimit._default_attributes[i]]  + 
            ((nftAttribLimit._max[nftAttribLimit._default_attributes[i]] - nftAttribLimit._min[nftAttribLimit._default_attributes[i]] + 1) * IUtil(_admin.getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100 );
        }

        uint8[] memory otherAttributes = randomSubList(nftAttribLimit._attributes, nftAttribLimit._total_attributes, randomValue, randomCount);
        randomCount += nftAttribLimit._total_attributes;

        for(uint8 i = 0; i < otherAttributes.length; i++) {
            attributes[otherAttributes[i]] = nftAttribLimit._min[otherAttributes[i]] + 
                ((nftAttribLimit._max[otherAttributes[i]] - nftAttribLimit._min[otherAttributes[i]] + 1) * IUtil(_admin.getUtilAddress()).sudoRandom(randomValue, randomCount ++) / 100);
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
        uint32 selected = uint32( IUtil(_admin.getUtilAddress()).randomNumber(owner) % (nftSupply._total_supply - nftSupply._total_consumed)) + 1;

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

        uint256 id = getNewNFTByLevel(fusionLevel, owner);

        _nfts[id].owner = owner;
        _user_holdings[owner].push(id);
        _user_holdings_id_index[owner][id] = _user_holdings[owner].length -1;
        _lastCall = block.timestamp;
        return id;
    }

    function doMint(uint8 capsuleType, uint8 capsuleLevel, address owner) public returns (uint256, uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
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

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }

    function randomSubList(uint8[] memory list, uint8 units, uint randomValue, uint8 startCount) public returns (uint8[] memory) {
        uint8[] memory subList = new uint8[](units);
        uint8 count = 0;
        // uint8 nonceIncrementor = 0;

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
