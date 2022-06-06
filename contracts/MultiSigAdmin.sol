// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract MultiSigAdmin {

    mapping(address=> uint8) _admins;
    address _treasury;
    mapping(address => uint8) _raffleAddresses; // Raffale Contract
    address _loaNFTAddress;
    address _nftMarketAddress;
    address _capsuleStakingAddress;

    constructor() {
        _admins[msg.sender] = 1;
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


    function getTreasury() public view returns (address) {
        return _treasury;
    }

    function modifyAdmin(address adminAddress, bool add) validAdmin public {
        if(add)
            _admins[adminAddress] = 1;
        else {
            require(adminAddress != msg.sender, "Cant remove self as admin");
            delete _admins[adminAddress];
        }
    }

    function modifyRaffleAddress(address raffleAddress, bool add) public validAdmin {
        if(add)
            _raffleAddresses[raffleAddress] = 1;
        else
            delete _raffleAddresses[raffleAddress];
    }

    function setAddresses(address loaNFTAddress, address nftMarketAddress, address capsuleStakingAddress) public validAdmin {
        _loaNFTAddress = loaNFTAddress;
        _nftMarketAddress = nftMarketAddress;
        _capsuleStakingAddress = capsuleStakingAddress;
    }

    function isValidCapsuleTransfer(address sender, address from, address to) public view returns (bool) {
        return isValidAdmin(sender) ||
            sender == _nftMarketAddress ||
            to == address(0) ||
            to == _capsuleStakingAddress ||
            from == _capsuleStakingAddress ||
            to == _nftMarketAddress ||
            from == _nftMarketAddress;
    }
}