// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract MultiSigAdmin {

    mapping(address=> uint8) _admins;
    address _treasury;
    mapping(address => uint8) _raffleAddresses; // Raffale Contract
    address[] public _contractAddresses;

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

    function updateContractAddresses(address[] memory contractAddresses) public validAdmin {
        delete _contractAddresses;
        _contractAddresses = contractAddresses;
    }

    function isValidMarketPlaceContract(address sender) public view returns (bool) {
        for(uint256 i = 0; i < _contractAddresses.length; i++) {
            if(sender == _contractAddresses[i])
                return true;
        }
        return false;
    }

    function isValidCapsuleTransfer(address sender, address from, address to) public view returns (bool) {
        for(uint256 i = 0; i < _contractAddresses.length; i++) {
            if(sender == _contractAddresses[i] || from == _contractAddresses[i] || to == _contractAddresses[i])
                return true;
        }
        return false;
    }
}