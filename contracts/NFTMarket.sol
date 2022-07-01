// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
import "./IAdmin.sol";

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
    function getNFTDetail(uint256 id) external view returns ( uint8, uint8, address, uint8, string memory);
}

interface ICapsuleDataContract {
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8, address, uint256, uint256);
}

contract NFTMarket is ERC1155Holder {

    using Counters for Counters.Counter;
    Counters.Counter _itemIds;
    Counters.Counter _itemsSold;
    IERC20Contract _erc20Token; // External BUSD contract

    MarketItem[] _listed_items;
    mapping(uint256 => uint256) _listed_items_to_index;
    mapping(address => mapping(uint256 => uint256)) public _addess_to_id_to_itemId;
    mapping(address => uint256) public _user_balance;
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
        string attributes,
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
        string attributes;
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
            "",
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
        require(price > 0, "Price must be at least 1 wei");
        require(_listingFee[nftContract] > 0, "This NFT is not permitted to be listed.");

        IERC1155 erc1155 = IERC1155(nftContract);

        require(erc1155.balanceOf(msg.sender, tokenId) == 1, "User doesn't have enough NFT Units.");
        require(_erc20Token.balanceOf(msg.sender) >= _listingFee[nftContract], "User doesn't have enough listing fee balance.");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        if(nftContract == _admin.getNFTAddress()) {
            (uint8 hero, uint8 level, , , string memory attributes) = INFTData(_admin.getNFTDataAddress()).getNFTDetail(tokenId);
            
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
                "",
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
                "",
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
        require( erc1155.balanceOf(address(this), tokenId) == 1, "Contract doesn't have enought NFT Units.");

        erc1155.safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");

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
    }

    function updatePrice(uint256 itemId, uint256 price) public {
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
        require(IERC1155(_admin.getNFTAddress()).balanceOf(msg.sender, id) == 1, "NFT doest belong to you");

        IERC1155(_admin.getNFTAddress()).safeTransferFrom(msg.sender, address(this), id, 1, "");
        IERC1155(_admin.getNFTAddress()).safeTransferFrom(address(this), to, id, 1, "");

        // emit NFTTransferred(id, msg.sender, to);
    }
    

    function buy(uint256 itemId)
        external
        payable
    {
        uint256 index = _listed_items_to_index[itemId];
        require(index != 0, "Item not present");

        uint256 price = _listed_items[index].price;
        uint256 tokenId = _listed_items[index].tokenId;
        address nftContract = _listed_items[index].nftContract;

        require(
            _erc20Token.balanceOf(msg.sender) >= price,
            "Required LOA balance is not available."
        );
        
        //transfer seller amount
        uint256 transFee = price * _transactionFee[nftContract] / 1000;
        // _erc20Token.transferFrom(msg.sender, _admin.getTreasury(), transFee);
        // _erc20Token.transferFrom(msg.sender, _listed_items[index].seller, price - transFee);
        _erc20Token.transferFrom(msg.sender, address(this), price);
        _erc20Token.transfer(_listed_items[index].seller, price - transFee);
        _erc20Token.transfer(_admin.getTreasury(), transFee);

        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");

        if(_listed_items[index].nftContract == _admin.getNFTAddress()) {
            (uint8 hero, uint8 level, , , string memory attributes) = INFTData(_admin.getNFTDataAddress()).getNFTDetail(tokenId);
    
            emit MarketItemAction(
                itemId,
                _listed_items[index].nftContract,
                _listed_items[index].tokenId,
                _listed_items[index].seller,
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
                _listed_items[index].nftContract,
                _listed_items[index].tokenId,
                _listed_items[index].seller,
                msg.sender,
                price,
                4,
                "",
                0,
                _listed_items[index].level,
                _listed_items[index].status
            );

        }
        delete _addess_to_id_to_itemId[_listed_items[index].nftContract][tokenId];

        _listed_items[index] = _listed_items[_listed_items.length - 1];
        _listed_items_to_index[_listed_items[index].itemId] = index;
        _listed_items.pop();
        delete _listed_items_to_index[itemId];
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        return _listed_items;
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
