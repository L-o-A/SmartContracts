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

    address _loaNFTAddress;
    address _treasury;
    mapping(uint256 => mapping(uint8 => uint64)) _nft_attributes;
    mapping(uint64 => string) private _nft_attribute_names;
    mapping(address => uint8) _admins;
    mapping(address => uint8) _axionAddresses; // Axion Contract

    constructor() {
        _admins[msg.sender] = 1;
    }

    function setNFTAddress(address loaNFTAddress, address treasury) public validAdmin {
        _loaNFTAddress = loaNFTAddress;
        _treasury = treasury;
    }

    function modifyAxionAddresses(address axionAddress, bool add) public validAdmin {
        if(add)
            _axionAddresses[axionAddress] = 1;
        else
            delete _axionAddresses[axionAddress];
    }

    // Modifier
    modifier validAdmin() {
        require(_admins[msg.sender] == 1, "You are not authorized.");
        _;
    }

    function modifyAdmin(address adminAddress, bool add) validAdmin public {
        if(add)
            _admins[adminAddress] = 1;
        else {
            require(adminAddress != msg.sender, "Cant remove self as admin");
            delete _admins[adminAddress];
        }
    }
    
    function modifyProperty(uint256 id, uint8 removePropIndex, uint8 addPropIndex, uint64 propValue) public {
        require(_axionAddresses[msg.sender] == 1, "Not authorized axion contract");
        require(_nft_attributes[id][addPropIndex] == 0, "New property value already present");
        require(_nft_attributes[id][removePropIndex] > 0, "Property to be removed doesnt exist");

        delete _nft_attributes[id][removePropIndex];
        _nft_attributes[id][addPropIndex] = propValue;
    }


    function getNFTAttributes(uint256 id, uint8 startIndex) public view returns (uint64, uint64, uint64, uint64, uint64) {
        (,,,uint8 nft_status) = LoaNFTContract(_loaNFTAddress).getNFTDetail(id);

        require(nft_status == 2, "Id is not minted");
        require(startIndex < 252, "startIndex exceeding bounds");

        return (
            _nft_attributes[id][startIndex],
            _nft_attributes[id][startIndex + 1],
            _nft_attributes[id][startIndex + 2],
            _nft_attributes[id][startIndex + 3],
            _nft_attributes[id][startIndex + 4]
        );
    }

    function putNFTAttributes (uint256[] memory ids,
        uint8 attributeStartIndex,
        uint64[] memory attrib_1,
        uint64[] memory attrib_2,
        uint64[] memory attrib_3,
        uint64[] memory attrib_4,
        uint64[] memory attrib_5) public validAdmin {

        require(ids.length ==  attrib_1.length 
                && ids.length == attrib_2.length 
                && ids.length == attrib_3.length 
                && ids.length == attrib_4.length 
                && ids.length == attrib_5.length, "Args length not matching");
        
            for (uint256 i = 0; i < ids.length; i++) {
                (,,,uint8 nft_status) = LoaNFTContract(_loaNFTAddress).getNFTDetail(ids[i]);
                require(nft_status != 0, "Id is not published");

                _nft_attributes[ids[i]][attributeStartIndex] = attrib_1[i];
                _nft_attributes[ids[i]][attributeStartIndex + 1] = attrib_2[i];
                _nft_attributes[ids[i]][attributeStartIndex + 2] = attrib_3[i];
                _nft_attributes[ids[i]][attributeStartIndex + 3] = attrib_4[i];
                _nft_attributes[ids[i]][attributeStartIndex + 4] = attrib_5[i];
        }
    }

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_treasury).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_treasury, token.balanceOf(address(this)));
    }
}