// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

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
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8, address, uint256, uint256);
}

contract AxionSphere is ERC1155, Ownable {

    address _loaAddress;
    address _nftMarketAddress;
    address _loaNFTAttributeAddress;
    mapping(address => uint8) _admins;
    address _treasury;
    string _uri;

    uint256 public _minting_fee;

    event NFTModified (
        uint256 indexed id,
        address indexed owner
    );

    constructor(address loaAddress, string memory url)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _loaAddress = loaAddress;
        _admins[msg.sender] = 1;
        _uri = url;
    }

    function uri(uint256 id) public override view returns (string memory) {
        return _uri;
    }

    function updateAccessAddressAndFees (
        address nftMarketAddress,
        address loaNFTAttributeAddress,
        uint256 fee) public validAdmin{
        _nftMarketAddress = nftMarketAddress;
        _loaNFTAttributeAddress = loaNFTAttributeAddress;
        _minting_fee = fee;
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

    // function buy(uint8 units) public view returns (uint8, uint8, address, uint8) {
    //     if(msg.sender != _loaNFTAttributeAddress)
    //         require(_nft_status[id] == 2, "Id is not minted");

    //     return (
    //         _nft_hero[id],
    //         _nft_level[id],
    //         _nft_owner[id],
    //         _nft_status[id]
    //     );
    // }



}