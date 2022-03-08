// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

import "hardhat/console.sol";

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

contract SellerPayment {

    IERC20Contract public _erc20Token;

    constructor(address erc20) {
        _erc20Token = IERC20Contract(erc20);
    }

    function pay(address from, address to, uint256 amount) external returns (bool) {
        return _erc20Token.transferFrom(from, to, amount);
    }
}

contract NFTMarket is ReentrancyGuard, ERC1155Holder{

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    IERC20Contract public _erc20Token; // External BUSD contract
    address private _admin;

    constructor(address erc20Contract) payable {
        _admin = msg.sender;
        _erc20Token = IERC20Contract(erc20Contract);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 units;
        uint256 price;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(address => uint256[]) private adddressToItemIds;
    mapping(address => uint256) private userBalance;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 units,
        uint256 price
    );

    function calcCommision(uint256 value) 
        private 
        pure
        returns(uint256) {
        return SafeMath.div(value, uint256(20));
    }

    function getMarketItem(uint256 marketItemId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 units,
        uint256 unitPrice
    ) public nonReentrant {
        require(unitPrice > 0, "Price must be at least 1 wei");

        IERC1155 erc1155 = IERC1155(nftContract);

        require(erc1155.balanceOf(msg.sender, tokenId) >= units, "User doesn't have enought NFT Units.");


        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        uint256 price = unitPrice; 

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            units,
            price
        );
        
        erc1155.safeTransferFrom(msg.sender, address(this), tokenId, units, "0x00");
        //erc1155.safeTransferFrom(msg.sender, _admin, tokenId, units, "0x00");

        console.log("Listing complete");

        adddressToItemIds[msg.sender].push(tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            units,
            price
        );
    }


    function unlistNFT(uint256 itemId)
        public
        nonReentrant
    {
        
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 listedUnits = idToMarketItem[itemId].units;
        require(
            msg.sender == idToMarketItem[itemId].seller,
            "Only NFT owner can unlist"
        );
        require(
            listedUnits > 0,
            "No units are listed for sale"
        );

        IERC1155 erc1155 = IERC1155(idToMarketItem[itemId].nftContract);
        require(erc1155.balanceOf(address(this), tokenId) >= listedUnits, "Contract doesn't have enought NFT Units.");
        

        //Remove sender listed item ids
        uint256[] storage itemIds = adddressToItemIds[msg.sender];

        for (uint256 i = 0; i < itemIds.length; i++) {
            if(itemIds[i] == itemId) {
                delete itemIds[i];
                delete idToMarketItem[itemId];
                break;
            }
        }

        erc1155.safeTransferFrom(address(this), msg.sender, tokenId, listedUnits, "0x00");
        // erc1155.safeTransferFrom(_admin, msg.sender, tokenId, listedUnits, "0x00");
    }

    

    function buyNFT(uint256 itemId, uint256 units)
        external
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 listedUnits = idToMarketItem[itemId].units;
        address nftContract = idToMarketItem[itemId].nftContract;
        uint256 totalPrice = SafeMath.mul(price , units);

        console.log("Total Price :", totalPrice);
        
        require(
            units <= listedUnits,
            "Listed units are less than asking units"
        );
        require(
            _erc20Token.balanceOf(msg.sender) >= totalPrice,
            "Required LOA balance is not available."
        );
        console.log("LOA balance available");
        


        //Remove sender listed item ids
        uint256[] storage itemIds = adddressToItemIds[msg.sender];

        for (uint256 i = 0; i < itemIds.length; i++) {
            if(itemIds[i] == itemId) {
                if(listedUnits == units) {
                    delete itemIds[i];
                    delete idToMarketItem[itemId];
                } else {
                    idToMarketItem[itemId].units = SafeMath.sub(listedUnits, units);
                }
                break;
            }
        }
        
        console.log("LOA transferred from buyer initiated.");

        require(
            _erc20Token.transferFrom(msg.sender, address(this), totalPrice),
            "Transfer from buyer failed"
        );




        console.log("LOA transferred from buyer");

        //transfer seller amount
        //idToMarketItem[itemId].seller.transfer(price);
        uint256 commission = calcCommision(totalPrice);
        uint256 sellPrice = SafeMath.sub(totalPrice, commission);
        console.log("Seller Amount :", sellPrice);
        console.log("current a/c balance :", _erc20Token.balanceOf(address(this)));

        userBalance[address(this)] = SafeMath.add(userBalance[address(this)], commission);
        userBalance[idToMarketItem[itemId].seller] = SafeMath.add(userBalance[idToMarketItem[itemId].seller], sellPrice);
        

        console.log("Seller Amount transferred");
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, units, "0x00");
        console.log("NFTs transferred");
        
    }

    function fetchMarketItem(uint256 itemId)
        public
        view
        returns (MarketItem memory)
    {
        MarketItem memory item = idToMarketItem[itemId];
        return item;
    }
    

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // function fetchMyNFTs() public view returns (MarketItem[] memory) {
    //     uint256 totalItemCount = _itemIds.current();
    //     uint256 itemCount = 0;
    //     uint256 currentIndex = 0;

    //     MarketItem[] memory items = new MarketItem[](itemCount);
    //     for (uint256 i = 0; i < totalItemCount; i++) {
    //         if (idToMarketItem[i + 1].owner == msg.sender) {
    //             itemCount += 1;
    //             uint256 currentId = idToMarketItem[i + 1].itemId;
    //             MarketItem storage currentItem = idToMarketItem[currentId];
    //             items[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //     }

    //     return items;
    // }

    function fetchMyBalance() public view returns(uint256) {
        return userBalance[msg.sender];
    } 

    function withdrawMyPayment() public {
        uint256 balance = userBalance[msg.sender];
        require(balance > 0, "No balance present to withdraw." );

         _erc20Token.transferFrom(address(this), msg.sender, balance);
    } 

    function withdraw() public {
        require(_admin == msg.sender, "Only ownder can withdraw");
        uint256 balance = _erc20Token.balanceOf(address(this));
        require(balance > 0, "No balance present to withdraw." );

         _erc20Token.transferFrom(address(this), _admin, balance);
    } 
}
