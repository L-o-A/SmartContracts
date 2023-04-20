// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "hardhat/console.sol";

interface IAdmin {
    function isValidMarketPlaceContract(address sender) external view returns (bool);
    function isValidAdmin(address adminAddress) external pure returns (bool);
}

contract LOAUtil {

    address public _admin;

    // constructor() {
    //     _admin = msg.sender;
    // }

    function init(address adminContractAddress) public {
        require(_admin == address(0), "Already initalized");
        _admin = adminContractAddress;
    }

    mapping(address => uint256[]) private _random_nos;

    event RequestingRandom (
        address requestor,
        uint32 units
    );

    modifier validAdmin() {
        require(IAdmin(_admin).isValidAdmin(msg.sender), "Unauthorized");
        _;
    }

    function updateAdmin(address admin) public validAdmin {
        _admin = admin;
    }

    //When owner wants to mint an NFT or Capsule our backend contract will first push random nos using fullfillRandom() function.
    //There should be 
    function randomNumber(address owner) public returns (uint256) {
        require(IAdmin(_admin).isValidMarketPlaceContract(msg.sender), "Unauthorized");
        
        unchecked {
            // uint256 num = uint256(keccak256(abi.encodePacked(block.timestamp + nonce, msg.sender, block.difficulty)));
            require(_random_nos[owner].length > 0, "No random no available");
            uint256 num = _random_nos[owner][_random_nos[owner].length -1];
            _random_nos[owner].pop();

            if(num < 1_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000) {
                num = uint256(num * num);
            }
            return num;
        }
    }

    function sudoRandom(uint256 randomValue, uint32 slot) public pure returns(uint8) {
        unchecked {
            slot = slot % 31;
            return uint8(randomValue % (100 ** (slot + 1)) / (100 ** slot));
        }
    }

    function randomCount() public view returns (uint256) {
        return _random_nos[msg.sender].length;
    }

    function requestRandom(uint32 units) public {
        if(_random_nos[msg.sender].length < units) {
            emit RequestingRandom(msg.sender, uint32(units - _random_nos[msg.sender].length));
        }
    }

    function fullfillRandom(address requestor, uint256[] memory randoms) public validAdmin {
        for(uint256 i = 0; i < randoms.length; i++) {
            _random_nos[requestor].push(randoms[i]);
        }
    }
}
