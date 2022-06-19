// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LoANFT.sol";


interface LoaNFTContract {
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getNFTDetail(uint256 id) external view returns (uint8, uint8, address, uint8);
}


contract LoANFTAttributes {

    mapping(uint256 => string) _nft_attributes;
    string public _nft_attribute_names;
    mapping(address => uint8) _axionAddresses; // Axion Contract

    Admin _admin;

    constructor(address adminContractAddress) {
        _admin = Admin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
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
        (,,,uint8 nft_status) = LoaNFTContract(_admin.getNFTAddress()).getNFTDetail(id);

        require(nft_status == 2, "Id is not minted");
        return (_nft_attributes[id]);
    }

    function putNFTAttributeNames (string memory nft_attribute_names) public validAdmin {
        _nft_attribute_names = nft_attribute_names;
    }

    function putNFTAttributes (uint256[] memory ids, string[] memory attribs) public validAdmin {

        require(ids.length ==  attribs.length, "Args length not matching");
        for (uint256 i = 0; i < ids.length; i++) {
            (,,,uint8 nft_status) = LoaNFTContract(_admin.getNFTAddress()).getNFTDetail(ids[i]);
            require(nft_status == 1, "Id is not published");

            _nft_attributes[ids[i]] = attribs[i];
        }
    }

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }
}