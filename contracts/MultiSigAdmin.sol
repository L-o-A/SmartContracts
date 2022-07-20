// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "hardhat/console.sol";

contract MultiSigAdmin {

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
    uint32[][] _random_values;

    constructor() {
        _admins[msg.sender] = 1;
        _adminList.push(msg.sender);
    }


    function initialize() public {
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
        _axionAddress = axionAddress;
    }

    function getAxionAddress() public view returns (address) {
        return _axionAddress;
    }

    function setFusionAddress(address nftFusionAddress) public validAdmin {
        _nftFusionAddress = nftFusionAddress;
    }

    function getFusionAddress() public view returns (address) {
        return _nftFusionAddress;
    }

    function setMarketAddress(address marketAddress) public validAdmin {
        _marketAddress = marketAddress;
    }

    function getMarketAddress() public view returns (address) {
        return _marketAddress;
    }

    function setNFTAddress(address nftAddress) public validAdmin {
        _nftAddress = nftAddress;
    }

    function getNFTAddress() public view returns (address) {
        return _nftAddress;
    }

    function setCapsuleAddress(address capsuleAddress) public validAdmin {
        _capsuleAddress = capsuleAddress;
    }

    function getCapsuleAddress() public view returns (address) {
        return _capsuleAddress;
    }

    function setCapsuleStakingAddress(address capsuleStakingAddress) public validAdmin {
        _capsuleStakingAddress = capsuleStakingAddress;
    }

    function getCapsuleStakingAddress() public view returns (address) {
        return _capsuleStakingAddress;
    }

    function setCapsuleDataAddress(address capsuleDataAddress) public validAdmin {
        _capsuleDataAddress = capsuleDataAddress;
    }

    function getCapsuleDataAddress() public view returns (address) {
        return _capsuleDataAddress;
    }

    function setNFTDataAddress(address nftDataAddress) public validAdmin {
        _nftDataAddress = nftDataAddress;
    }

    function getNFTDataAddress() public view returns (address) {
        return _nftDataAddress;
    }

    function modifyAdmin(address adminAddress, bool add) validAdmin public {
        if(add) {
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

    function random(uint256 limit, uint randNonce) public view returns (uint32) {
        if(limit == 0) return 0;
        // return uint32(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % limit);
        // return uint32(uint256(keccak256(abi.encodePacked(_lastCall * _nftCounter.current(), msg.sender, randNonce))) % limit);
        // return uint256((_lastCall * _nftCounter.current() * _nftCounter.current() + randNonce * randNonce) % limit);
        uint64 val = _random_values[uint32((block.timestamp * randNonce) % _random_values.length)][uint32((block.timestamp * randNonce) % 500)];
        return uint32((val * val)% limit);
    }

    function setRandomValues(uint32[] memory random_values) public validAdmin {
        require(random_values.length == 500, "Incomplete");
        _random_values.push(random_values);
    }
}