// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "hardhat/console.sol";

contract MultiSigAdmin is OwnableUpgradeable {

    mapping(address=> uint8) public _admins;
    address _treasury;
    mapping(address => uint8) _raffleAddresses; // Raffale Contract
    address[] public _adminList;
    address _capsuleStakingAddress;
    address _capsuleDataAddress;
    address _capsuleAddress;
    address _nftAddress;
    address _marketAddress;
    address _nftFusionAddress;
    address _axionAddress;
    address _nftDataAddress;
    address _util_address;


    // Proxy initialization method
    function initialize () public initializer {
        _admins[msg.sender] = 1;
        _adminList.push(msg.sender);
    }

    modifier validAdmin() {
        require(_admins[msg.sender] == 1, "You are not authorized.");
        _;
    }

    function isValidAdmin(address adminAddress) public view returns (bool) {
        return _admins[adminAddress] == 1;
    }

    function isValidRaffleAddress(address addr) public view returns (bool) {
        return _raffleAddresses[addr] == 1;
    }

    function setTreasury(address treasury) public validAdmin {
        _treasury = treasury;
    }

    function getTreasury() public view returns (address) {
        return _treasury;
    }

    function setAxionAddress(address axionAddress) public validAdmin {
        require(_axionAddress == address(0), "axionAddress aleady initialized");
        _axionAddress = axionAddress;
    }

    function getAxionAddress() public view returns (address) {
        return _axionAddress;
    }

    function setFusionAddress(address nftFusionAddress) public validAdmin {
        require(_nftFusionAddress == address(0), "nftFusionAddress aleady initialized");
        _nftFusionAddress = nftFusionAddress;
    }

    function getFusionAddress() public view returns (address) {
        return _nftFusionAddress;
    }

    function setMarketAddress(address marketAddress) public validAdmin {
        require(_marketAddress == address(0), "marketAddress aleady initialized");
        _marketAddress = marketAddress;
    }

    function getMarketAddress() public view returns (address) {
        return _marketAddress;
    }

    function setNFTAddress(address nftAddress) public validAdmin {
        require(_nftAddress == address(0), "nftAddress aleady initialized");
        _nftAddress = nftAddress;
    }

    function getNFTAddress() public view returns (address) {
        return _nftAddress;
    }

    function setCapsuleAddress(address capsuleAddress) public validAdmin {
        require(_capsuleAddress == address(0), "capsuleAddress aleady initialized");
        _capsuleAddress = capsuleAddress;
    }

    function getCapsuleAddress() public view returns (address) {
        return _capsuleAddress;
    }

    function setCapsuleStakingAddress(address capsuleStakingAddress) public validAdmin {
        require(_capsuleStakingAddress == address(0), "capsuleStakingAddress aleady initialized");
        _capsuleStakingAddress = capsuleStakingAddress;
    }

    function getCapsuleStakingAddress() public view returns (address) {
        return _capsuleStakingAddress;
    }

    function setCapsuleDataAddress(address capsuleDataAddress) public validAdmin {
        require(_capsuleDataAddress == address(0), "capsuleDataAddress aleady initialized");
        _capsuleDataAddress = capsuleDataAddress;
    }

    function getCapsuleDataAddress() public view returns (address) {
        return _capsuleDataAddress;
    }

    function setNFTDataAddress(address nftDataAddress) public validAdmin {
        require(_nftDataAddress == address(0), "nftDataAddress aleady initialized");
        _nftDataAddress = nftDataAddress;
    }

    function getNFTDataAddress() public view returns (address) {
        return _nftDataAddress;
    }

    function setUtilAddress(address utilAddress) public validAdmin {
        require(_util_address == address(0), "util_address aleady initialized");
        _util_address = utilAddress;
    }

    function getUtilAddress() public view returns (address) {
        return _util_address;
    }

    function modifyAdmin(address adminAddress, bool add) validAdmin public {
        if(add) {
            require(_admins[adminAddress] != 1, "Admin already added");
            _admins[adminAddress] = 1;
            _adminList.push(adminAddress);
        } else {
            require(adminAddress != msg.sender, "Cant remove self as admin");
            delete _admins[adminAddress];
            for(uint256 i = 0; i < _adminList.length; i++) {
                if(_adminList[i] == adminAddress) {
                    _adminList[i] = _adminList[_adminList.length - 1];
                    _adminList.pop();
                    break;
                }
            }
        }
    }

    function modifyRaffleAddress(address raffleAddress, bool add) public validAdmin {
        if(add)
            _raffleAddresses[raffleAddress] = 1;
        else
            delete _raffleAddresses[raffleAddress];
    }

    function isValidMarketPlaceContract(address sender) public view returns (bool) {
        if(_raffleAddresses[sender] == 1)
            return true;

        if(_capsuleStakingAddress == sender 
                || _capsuleAddress == sender 
                || _capsuleDataAddress == sender 
                || _nftAddress == sender 
                || _marketAddress == sender 
                || _nftFusionAddress == sender 
                || _axionAddress == sender 
                || _nftDataAddress == sender)
            return true;

        return false;
    }

    function isValidCapsuleTransfer(address sender, address from, address to) public view returns (bool) {
        if(isValidMarketPlaceContract(sender)
                || isValidMarketPlaceContract(from)
                || isValidMarketPlaceContract(to))
            return true;
        return false;
    }
}