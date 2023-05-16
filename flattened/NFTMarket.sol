

// Sources flattened with hardhat v2.14.0 https://hardhat.org

// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v4.6.0

// SPDX-License-Identifier: MIT OR Apache-2.0
// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol@v4.6.0


// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC1155/IERC1155Receiver.sol)

pragma solidity ^0.8.0;

/**
 * @dev _Available since v3.1._
 */
interface IERC1155Receiver is IERC165 {
    /**
     * @dev Handles the receipt of a single ERC1155 token type. This function is
     * called at the end of a `safeTransferFrom` after the balance has been updated.
     *
     * NOTE: To accept the transfer, this must return
     * `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
     * (i.e. 0xf23a6e61, or its own function selector).
     *
     * @param operator The address which initiated the transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param id The ID of the token being transferred
     * @param value The amount of tokens being transferred
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
     * @dev Handles the receipt of a multiple ERC1155 token types. This function
     * is called at the end of a `safeBatchTransferFrom` after the balances have
     * been updated.
     *
     * NOTE: To accept the transfer(s), this must return
     * `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
     * (i.e. 0xbc197c81, or its own function selector).
     *
     * @param operator The address which initiated the batch transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param ids An array containing ids of each token being transferred (order and length must match values array)
     * @param values An array containing amounts of each token being transferred (order and length must match ids array)
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}


// File @openzeppelin/contracts/utils/introspection/ERC165.sol@v4.6.0


// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}


// File @openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol@v4.6.0


// OpenZeppelin Contracts v4.4.1 (token/ERC1155/utils/ERC1155Receiver.sol)

pragma solidity ^0.8.0;


/**
 * @dev _Available since v3.1._
 */
abstract contract ERC1155Receiver is ERC165, IERC1155Receiver {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}


// File @openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol@v4.6.0


// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC1155/utils/ERC1155Holder.sol)

pragma solidity ^0.8.0;

/**
 * Simple implementation of `ERC1155Receiver` that will allow a contract to hold ERC1155 tokens.
 *
 * IMPORTANT: When inheriting this contract, you must include a way to use the received tokens, otherwise they will be
 * stuck.
 *
 * @dev _Available since v3.1._
 */
contract ERC1155Holder is ERC1155Receiver {
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
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


// File contracts/NFTMarket.sol


pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


// import "hardhat/console.sol";

interface IERC1155 {
    
    event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value);

    event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values);

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    event URI(string _value, uint256 indexed _id);

    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;

    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external;

    function balanceOf(address _owner, uint256 _id) external view returns (uint256);

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);

    function setApprovalForAll(address _operator, bool _approved) external;
    
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

interface IERC20Contract {
    // External ERC20 contract
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

interface INFTData {
    function getNFTDetail(uint256 id) external view returns ( uint256, uint8, address, uint8, uint8, uint64[] memory);
}

interface ICapsuleDataContract {
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8, address, uint256, uint256);
}

contract NFTMarket is ERC1155Holder {

    using Counters for Counters.Counter;
    Counters.Counter _itemIds;
    Counters.Counter public _itemsSold;
    IERC20Contract _erc20Token; // External BUSD contract

    MarketItem[] _listed_items;
    mapping(uint256 => uint256) _listed_items_to_index;
    mapping(address => mapping(uint256 => uint256)) public _addess_to_id_to_itemId;
    mapping(address => uint256) public _listingFee;
    mapping(address => uint256) public _transactionFee;
    uint256 public _totalLOAStaked;
    bool public _giftingEnabled = true; 

    IAdmin _admin;

    event MarketItemAction(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        uint8 action,
        uint64[] attributes,
        uint8 hero,
        uint8 level,
        uint8 status
    );

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        uint64[] attributes;
        uint8 hero;
        uint8 level;
        uint8 status;
    }

    // event NFTTransferred(
    //     uint256 indexed itemId,
    //     address from,
    //     address to
    // );

    constructor(address erc20Contract, address adminContractAddress) payable {
        _erc20Token = IERC20Contract(erc20Contract);
        _admin = IAdmin(adminContractAddress);
        //adding empty index
        _listed_items.push(MarketItem(
            0,
            address(0),
            0,
            address(0),
            address(0),
            0,
            new uint64[](0),
            0,
            0,
            0
        ));
    }

    function updateGifting(bool gifting) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized");
        _giftingEnabled = gifting;
    }

    function updateFees (
        address[] memory contractAddresses, 
        uint256[] memory listingFees,
        uint256[] memory trasactionFees) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized");

        for(uint8 i = 0; i < contractAddresses.length; i++) {
            _listingFee[contractAddresses[i]] = listingFees[i];
            _transactionFee[contractAddresses[i]] = trasactionFees[i];
        }
    }

    function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
        return _listed_items[_listed_items_to_index[marketItemId]];
    }

    function list( address nftContract, uint256 tokenId, uint256 price) public {
        require(price > 1e18, "Price must be at least 1 USD");
        require(_listingFee[nftContract] > 0, "This NFT is not permitted to be listed.");

        IERC1155 erc1155 = IERC1155(nftContract);

        require(erc1155.balanceOf(msg.sender, tokenId) > 0, "User doesn't have enough NFT Units.");
        require(_erc20Token.balanceOf(msg.sender) >= _listingFee[nftContract], "User doesn't have enough listing fee balance.");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        if(nftContract == _admin.getNFTAddress()) {
            (, , , uint8 level , uint8 hero, uint64[] memory attributes) = INFTData(_admin.getNFTDataAddress()).getNFTDetail(tokenId);
            _listed_items.push(MarketItem(
                itemId,
                nftContract,
                tokenId,
                msg.sender,
                address(0),
                price,
                attributes,
                hero,
                level,
                0
            ));

            emit MarketItemAction(
                itemId,
                nftContract,
                tokenId,
                msg.sender,
                address(0),
                price,
                1,
                attributes,
                hero,
                level,
                0
            );

        } else {

            (uint8 capsuleType, ,uint8 capsuleStatus , , ,) = ICapsuleDataContract(_admin.getCapsuleDataAddress()).getCapsuleDetail(tokenId);
            _listed_items.push(MarketItem(
                itemId,
                nftContract,
                tokenId,
                msg.sender,
                address(0),
                price,
                new uint64[](0),
                0,
                capsuleType,
                capsuleStatus
            ));

            emit MarketItemAction(
                itemId,
                nftContract,
                tokenId,
                msg.sender,
                address(0),
                price,
                1,
                new uint64[](0),
                0,
                capsuleType,
                capsuleStatus
            );
        }



        _listed_items_to_index[itemId] = _listed_items.length - 1;
        _addess_to_id_to_itemId[nftContract][tokenId] = itemId;
        
        _erc20Token.transferFrom(msg.sender, _admin.getTreasury(), _listingFee[nftContract]);
        erc1155.safeTransferFrom(msg.sender, address(this), tokenId, 1, "0x00");
        
        
    }

    function unlist(uint256 itemId) public {
        uint256 index = _listed_items_to_index[itemId];

        uint256 tokenId = _listed_items[index].tokenId;
        require( msg.sender == _listed_items[index].seller,  "Only NFT owner can unlist" );

        IERC1155 erc1155 = IERC1155(_listed_items[index].nftContract);
        require( erc1155.balanceOf(address(this), tokenId) >= 1, "Contract doesn't have enough NFT Units.");

        emit MarketItemAction(
            itemId,
            _listed_items[index].nftContract,
            tokenId,
            msg.sender,
            address(0),
            _listed_items[index].price,
            2,
            _listed_items[index].attributes,
            _listed_items[index].hero,
            _listed_items[index].level,
            _listed_items[index].status
        );

        delete _addess_to_id_to_itemId[_listed_items[index].nftContract][tokenId];

        _listed_items[index] = _listed_items[_listed_items.length - 1];
        _listed_items_to_index[_listed_items[index].itemId] = index;
        _listed_items.pop();
        delete _listed_items_to_index[itemId];

        erc1155.safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");
    }

    function updatePrice(uint256 itemId, uint256 price) public {
        require(price > 0, "Listing price is zero");
        uint256 index = _listed_items_to_index[itemId];
        MarketItem storage marketItem = _listed_items[index];
        
        require(marketItem.seller == msg.sender, "You are not authorized");
        marketItem.price = price;

        emit MarketItemAction(
            itemId,
            marketItem.nftContract,
            marketItem.tokenId,
            msg.sender,
            address(0),
            price,
            3,
            _listed_items[index].attributes,
            _listed_items[index].hero,
            _listed_items[index].level,
            _listed_items[index].status
        ); 
    }

    function giftNFT(address to, uint256 id) public {
        require(_giftingEnabled, "Gifting is not enabled");
        require(IERC1155(_admin.getNFTAddress()).balanceOf(msg.sender, id) > 0, "NFT doest belong to you");

        IERC1155(_admin.getNFTAddress()).safeTransferFrom(msg.sender, address(this), id, 1, "");
        IERC1155(_admin.getNFTAddress()).safeTransferFrom(address(this), to, id, 1, "");

        // emit NFTTransferred(id, msg.sender, to);
    }
    

    function buy(uint256 itemId) external {
        uint256 index = _listed_items_to_index[itemId];
        require(index != 0, "Item not present");

        MarketItem storage marketItem = _listed_items[index];

        uint256 price = marketItem.price;
        uint256 tokenId = marketItem.tokenId;
        address nftContract = marketItem.nftContract;

        require(
            _erc20Token.balanceOf(msg.sender) >= price,
            "Required USD balance is not available."
        );
        
        //transfer seller amount
        uint256 transFee = price * _transactionFee[nftContract] / 1000;
        _erc20Token.transferFrom(msg.sender, address(this), price);
        _erc20Token.transfer(marketItem.seller, price - transFee);
        _erc20Token.transfer(_admin.getTreasury(), transFee);

        

        if(marketItem.nftContract == _admin.getNFTAddress()) {
            (, , , uint8 level, uint8 hero, uint64[] memory attributes) = INFTData(_admin.getNFTDataAddress()).getNFTDetail(tokenId);
    
            emit MarketItemAction(
                itemId,
                marketItem.nftContract,
                marketItem.tokenId,
                marketItem.seller,
                msg.sender,
                price,
                4,
                attributes,
                hero,
                level,
                0
            );
        } else {

            emit MarketItemAction(
                itemId,
                marketItem.nftContract,
                marketItem.tokenId,
                marketItem.seller,
                msg.sender,
                price,
                4,
                new uint64[](0),
                0,
                marketItem.level,
                marketItem.status
            );

        }
        delete _addess_to_id_to_itemId[marketItem.nftContract][tokenId];

        _listed_items[index] = _listed_items[_listed_items.length - 1];
        _listed_items_to_index[marketItem.itemId] = index;
        _listed_items.pop();
        delete _listed_items_to_index[itemId];

        _itemsSold.increment();
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        return _listed_items;
    }

    function extract(address tokenAddress) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");

        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }
        require(IERC20Contract(tokenAddress).balanceOf(address(this)) > 0, "No balance available");
        IERC20Contract(tokenAddress).transfer(_admin.getTreasury(), IERC20Contract(tokenAddress).balanceOf(address(this)));
    }
}
