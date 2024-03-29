// File contracts/LoANFT.sol


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./IAdmin.sol";

// import "hardhat/console.sol";

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

    function allowance(address _owner, address _spender) external view returns (uint256);
}

interface IERC1155Contract {
    function balanceOf(address tokenOwner, uint256 id)
        external
        view
        returns (uint256);

    function burn(address tokenOwner, uint256 id) external;
}


interface ICapsuleDataContract {
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8, address, uint256, uint256);
}

interface ILoANFTData {
    function doTransferFrom( address from, address to, uint256 id) external;
    // function doBatchTransfer(address from, address to, uint256[] memory ids) external;
    function doFusion(address owner, uint256[] memory ids, uint8 fusionLevel ) external returns (uint256);
    function doMint(uint8 capsuleType, uint8 capsuleLevel, address owner) external returns (uint256, uint256);
    function getNFTDetail(uint256 id) external view returns ( uint256, uint8, address, uint8, uint8, uint64[] memory);
}

contract LoANFT is ERC1155 {

    address _loaAddress;
    IAdmin _admin;
    ILoANFTData _nftData;
    mapping(uint8 => string) _nftHeroURI;

    event NFTMinted(
        uint256 indexed itemIds,
        uint256 indexed capsuleIds,
        address indexed buyer,
        uint256 price
    );

    error MintingFeeError(uint256 fee);

    constructor(address loaAddress, address adminContractAddress, address nftData)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _loaAddress = loaAddress;
        _admin = IAdmin(adminContractAddress);
        _nftData = ILoANFTData(nftData);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function putURI(uint8 nft_hero, string memory url) public validAdmin {
        _nftHeroURI[nft_hero] = url;
    }

    function uri(uint256 id) public override view returns (string memory) {
        (, , , , uint8 hero, ) = _nftData.getNFTDetail(id);
        return _nftHeroURI[hero];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidMarketPlaceContract(from) 
            || _admin.isValidMarketPlaceContract(to) 
            || _admin.isValidMarketPlaceContract(msg.sender),
                "Not authorized to transfer"
        );

        _nftData.doTransferFrom(from, to, id);
        

        return super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidMarketPlaceContract(from) 
            || _admin.isValidMarketPlaceContract(to) 
            || _admin.isValidMarketPlaceContract(msg.sender),
                "Not authorized to transfer"
        );

        for(uint256 i = 0; i < ids.length; i++){
            _nftData.doTransferFrom(from, to, ids[i]);
        }

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function fusion(
        address owner,
        uint256[] memory ids,
        uint8 fusionLevel,
        uint256 price
    ) public {
        require(msg.sender == _admin.getFusionAddress(), "Unauthorized");

        uint256 id = _nftData.doFusion( owner, ids, fusionLevel);
        _mint(owner, id, 1, "");
        for (uint8 i = 0; i < ids.length; i++) {
            _burn(owner, ids[i], 1);
        }
        emit NFTMinted(id, 0, owner, price);
    }

    function mint(uint256[] memory capsuleIds) public {

        uint256 mintingFee = 0;
        for(uint256 i = 0; i < capsuleIds.length; i++) {
            uint256 capsuleId = capsuleIds[i];
            require(IERC1155Contract(_admin.getCapsuleAddress()).balanceOf( msg.sender, capsuleId) > 0, "Capsule is not owned by user");
            (uint8 capsuleType, uint8 capsuleLevel, uint8 capsule_status,,,) = ICapsuleDataContract(_admin.getCapsuleDataAddress()).getCapsuleDetail(capsuleId);

            require(capsuleLevel > 0, "Capsule level not found");
            require(capsule_status == 4, "Capsule is not unlocked");

            (uint256 id, uint256 fee) = _nftData.doMint(capsuleType, capsuleLevel, msg.sender);
            mintingFee = mintingFee + fee;
            require(id > 0, "NFT not found");
            IERC1155Contract(_admin.getCapsuleAddress()).burn(msg.sender, capsuleId);
            _mint(msg.sender, id, 1, "");
            emit NFTMinted(id, capsuleId, msg.sender, 0);
        }

        if(IERC20Contract(_loaAddress).allowance(msg.sender, address(this)) < mintingFee) {
            revert MintingFeeError({fee: mintingFee });
        }
        IERC20Contract(_loaAddress).transferFrom(msg.sender, _admin.getTreasury(), mintingFee);
    }


    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20Contract(tokenAddress).transfer(_admin.getTreasury(), IERC20Contract(tokenAddress).balanceOf(address(this)));
    }
}
