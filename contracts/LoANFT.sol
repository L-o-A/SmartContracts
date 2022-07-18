// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IAdmin.sol";
import "./LoANFTData.sol";

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
}

interface IERC1155Contract {
    function balanceOf(address tokenOwner, uint256 id)
        external
        view
        returns (uint256);

    function burn(address tokenOwner, uint256 id) external;

    function getCapsuleDetail(uint256 id)
        external
        view
        returns (
            uint8,
            uint8,
            uint8, address, uint256, uint256
        );
}


interface ICapsuleDataContract {
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8, address, uint256, uint256);
}

interface ILoANFTData {
    function doTransferFrom( address from, address to, uint256 id) external;
    function doBatchTransfer(address from, address to, uint256[] memory ids) external;
    function doFusion(address owner, uint256[] memory ids, uint8 fusionLevel ) external returns (uint256);
    function doMint(uint8 capsuleLevel, address owner) external returns (uint256, uint256);
}

contract LoANFT is ERC1155, Ownable {

    address _loaAddress;
    IAdmin _admin;
    ILoANFTData _nftData;

    event NFTMinted(
        uint256 indexed itemIds,
        uint256 indexed capsuleIds,
        address indexed buyer,
        uint256 price
    );

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
        _nftData.doBatchTransfer(from, to, ids);

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
            (, uint8 capsuleLevel, uint8 capsule_status,,,) = ICapsuleDataContract(_admin.getCapsuleDataAddress()).getCapsuleDetail(capsuleId);

            require(capsuleLevel > 0, "Capsule level not found");
            require(capsule_status == 4, "Capsule is not unlocked");

            (uint256 id, uint256 fee) = _nftData.doMint(capsuleLevel, msg.sender);
            mintingFee = mintingFee + fee;
            require(id > 0, "NFT not found");
            IERC1155Contract(_admin.getCapsuleAddress()).burn(msg.sender, capsuleId);
            _mint(msg.sender, id, 1, "");
            emit NFTMinted(id, capsuleId, msg.sender, 0);
        }
        require(IERC20Contract(_loaAddress).transferFrom(msg.sender, _admin.getTreasury(), mintingFee) , "Not enough minting fee available");
    }


    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20Contract(tokenAddress).transfer(_admin.getTreasury(), IERC20Contract(tokenAddress).balanceOf(address(this)));
    }
}
