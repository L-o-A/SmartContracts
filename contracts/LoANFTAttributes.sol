// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./LoANFT.sol";
// import "./IAdmin.sol";


// interface LoaNFTContract {
//     function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
//     function burn(address tokenOwner, uint256 id) external;
//     function getNFTDetail(uint256 id) external view returns (uint8, uint8, address, uint8, string memory);
// }


// contract LoANFTAttributes {

    

//     IAdmin _admin;

//     constructor(address adminContractAddress) {
//         _admin = IAdmin(adminContractAddress);
//     }

//     // Modifier
//     modifier validAdmin() {
//         require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
//         _;
//     }

    

//     function withdraw(address tokenAddress) public validAdmin {
//         if (tokenAddress == address(0)) {
//             payable(_admin.getTreasury()).transfer(address(this).balance);
//             return;
//         }

//         IERC20Contract token = IERC20Contract(tokenAddress);
//         token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
//     }
// }