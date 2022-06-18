// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

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

interface Admin {
    function isValidAdmin(address adminAddress) external pure returns (bool);
    function getTreasury() external view returns (address);
    function isValidRaffleAddress(address addr) external view returns (bool);
    function isValidCapsuleTransfer(address sender, address from, address to) external view returns (bool);
    function isValidMarketPlaceContract(address sender) external view returns (bool);
}

contract NFTMarket is ReentrancyGuard, ERC1155Holder{

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    IERC20Contract public _erc20Token; // External BUSD contract
    IERC1155 _loaNFT;

    MarketItem[] public _id_to_listed_item;
    mapping(address => uint256[]) private _adddress_to_listed_item_ids;
    mapping(address => uint256) public _user_balance;
    mapping(address => uint256) private _listingFee;
    uint256 public _totalLOAStaked;

    Admin _admin;

    event MarketItemAction(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        uint8 action
    );

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
    }

    event NFTTransferred(
        uint256 indexed itemId,
        address from,
        address to
    );

    constructor(address erc20Contract, address loaNFT, address adminContractAddress) payable {
        _erc20Token = IERC20Contract(erc20Contract);
        _loaNFT = IERC1155(loaNFT);
        _admin = Admin(adminContractAddress);
    }

    function updateFees (
        address[] memory contractAddresses, 
        uint256[] memory fees) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized");

        for(uint8 i = 0; i < contractAddresses.length; i++) {
            _listingFee[contractAddresses[i]] = fees[i];
        }
    }

    function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
        return _id_to_listed_item[marketItemId];
    }

    function list( address nftContract, uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(_listingFee[nftContract] > 0, "This NFT is not permitted to be listed.");

        IERC1155 erc1155 = IERC1155(nftContract);

        require(erc1155.balanceOf(msg.sender, tokenId) == 1, "User doesn't have enought NFT Units.");
        require(_erc20Token.balanceOf(msg.sender) >= _listingFee[nftContract], "User doesn't have enough listing fee balance.");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        _id_to_listed_item[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price
        );
        
        _erc20Token.transferFrom(msg.sender, _admin.getTreasury(), _listingFee[nftContract]);
        erc1155.safeTransferFrom(msg.sender, address(this), tokenId, 1, "0x00");
        
        _adddress_to_listed_item_ids[msg.sender].push(itemId);

        emit MarketItemAction(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            1
        );
    }


    function unlist(uint256 itemId) public  nonReentrant {
        
        uint256 tokenId = _id_to_listed_item[itemId].tokenId;
        require( msg.sender == _id_to_listed_item[itemId].seller,  "Only NFT owner can unlist" );

        IERC1155 erc1155 = IERC1155(_id_to_listed_item[itemId].nftContract);
        require( erc1155.balanceOf(address(this), tokenId) == 1, "Contract doesn't have enought NFT Units.");

        //Remove sender listed item ids
        uint256[] storage itemIds = _adddress_to_listed_item_ids[msg.sender];

        for (uint256 i = 0; i < itemIds.length; i++) {
            if(itemIds[i] == itemId) {
                itemIds[i] = itemIds[itemIds.length - 1];
                itemIds.pop();
                break;
            }
        }

        erc1155.safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");
        emit MarketItemAction(
            itemId,
            _id_to_listed_item[itemId].nftContract,
            tokenId,
            msg.sender,
            address(0),
            0,
            2
        );
        delete _id_to_listed_item[itemId];
    }

    function updatePrice(uint256 itemId, uint256 price) public {
        MarketItem storage marketItem = _id_to_listed_item[itemId];
        require(marketItem.seller == msg.sender, "You are not authorized");
        marketItem.price = price;
        emit MarketItemAction(
            itemId,
            _id_to_listed_item[itemId].nftContract,
            _id_to_listed_item[itemId].tokenId,
            msg.sender,
            address(0),
            price,
            3
        );
    }

    function giftNFT(address to, uint256 id) public {
        require(_loaNFT.balanceOf(msg.sender, id) == 1, "NFT doest belong to you");

        _loaNFT.safeTransferFrom(msg.sender, address(this), id, 1, "");
        _loaNFT.safeTransferFrom(address(this), to, id, 1, "");

        emit NFTTransferred(id, msg.sender, to);
    }
    

    function buy(uint256 itemId)
        external
        payable
        nonReentrant
    {
        uint256 price = _id_to_listed_item[itemId].price;
        uint256 tokenId = _id_to_listed_item[itemId].tokenId;
        address nftContract = _id_to_listed_item[itemId].nftContract;

        require(
            _erc20Token.balanceOf(msg.sender) >= price,
            "Required LOA balance is not available."
        );
        
        //Remove sender listed item ids
        uint256[] storage itemIds = _adddress_to_listed_item_ids[msg.sender];

        for (uint256 i = 0; i < itemIds.length; i++) {
            if(itemIds[i] == itemId) {
                itemIds[i] = itemIds[itemIds.length -1];
                itemIds.pop();
                break;
            }
        }

        require(
            _erc20Token.transferFrom(msg.sender, address(this), price),
            "Transfer from buyer failed"
        );

        //transfer seller amount
        //_id_to_listed_item[itemId].seller.transfer(price);
        uint256 listingFee = _listingFee[nftContract];

        _user_balance[address(this)] = _user_balance[address(this)] + listingFee;
        _user_balance[_id_to_listed_item[itemId].seller] = _user_balance[_id_to_listed_item[itemId].seller] + price;
        

        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");

        emit MarketItemAction(
            itemId,
            _id_to_listed_item[itemId].nftContract,
            _id_to_listed_item[itemId].tokenId,
            _id_to_listed_item[itemId].seller,
            msg.sender,
            price,
            4
        );
        delete _id_to_listed_item[itemId];
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        // uint256 itemCount = _itemIds.current();
        // uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        // uint256 currentIndex = 0;

        // MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        // for (uint256 i = 0; i < itemCount; i++) {
        //     if (_id_to_listed_item[i + 1].owner == address(0)) {
        //         uint256 currentId = _id_to_listed_item[i + 1].itemId;
        //         MarketItem storage currentItem = _id_to_listed_item[currentId];
        //         items[currentIndex] = currentItem;
        //         currentIndex += 1;
        //     }
        // }
        return _id_to_listed_item;
    }

    function fetchMyListings() public view returns (MarketItem[] memory) {
        uint256[] storage itemIds = _adddress_to_listed_item_ids[msg.sender];

        MarketItem[] memory items = new MarketItem[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            items[i] = _id_to_listed_item[itemIds[i]];
        }
        return items;
    }

    function withdraw() public {
        uint256 balance = _user_balance[msg.sender];
        require(balance > 0, "No balance present to withdraw." );
         _erc20Token.transfer(msg.sender, balance);
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
}
