// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IAdmin.sol";
// import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// import "hardhat/console.sol";

/**
LOA Capsule is a ERC-1155 standard NFT.
    Standard Raffle: No. of LOA Capsules per draw is shown in table above (this amount is subjected to change). No limit on the number of wallets that can participate, each wallet can purchase any amount of raffle tickets.
    Each wallet can win more than 1 LOA Capsule, depending on how many raffle tickets owned by that specific wallet are selected as a winner.
    Standard Raffle price starts from $30 BUSD worth of $LOA Tokens for the first 5,000 raffle entries (the price may change seeing current marketplace conditions). As the raffle entries increases, the price of the raffle entries increases according to the tier which is based on the table above.
    Once you participate, your $LOA Tokens will be staked/frozen, at the end of the Raffle if you did not get a LOA Capsule you can redeem your $LOA Tokens.
    At the end of the raffle period, random raffle numbers will be drawn to identify the winners for the LOA Capsules. 
    Once you participate, your $LOA Tokens will be staked/held. At the end of the Raffle Event, you are able to redeem your $LOA Tokens if you did not get a LOA Capsule.
    The amount of $LOA Tokens staking requirements may change at a later time if deemed necessary by the team.
    All $LOA Tokens used to win the LOA Capsules will be sent to the Treasury Pool.
    Using Smart Contracts for the raffle is strictly prohibited.
    $LOA Token Holders will have the opportunity to vote on the Raffle Event rules in the future.
    Unclaimed LOA Capsules are stored in the Marketplace Storage for a period of time. After that time exceeds, the LOA Capsules will be forfeited and the $LOA Tokens staked will be returned to the respective wallets.
 */

interface IERC20Contract {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address tokenOwner) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IRaffle {
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getTicketDetail(uint256 id) external view returns (uint8 , uint256, address, uint8);
}


interface ICapsuleData {
    function getNewCapsuleIdByType(uint8 kind, address owner) external returns (uint256);
    function doBurn(uint256 id, address owner) external;
    function doTransfer(uint256 id, address owner) external;
}

/**
 * Capsule Contract used for creating Capsule NFT for LOA.
 * It follow ERC1155 standard
 * It mints only 1 instance of 1 NFT type. Each capusule will have uniquie no allocated to it.
 */
contract Capsule is ERC1155, Ownable {

    IAdmin _admin;

    event CapsuleMinted(
        uint256[] indexed itemId,
        address indexed buyer,
        uint256 totalPrice
    );

    constructor(address adminContractAddress) ERC1155("https://capsule.leagueofancients.com/api/capsule/{id}.json") {
        _admin = IAdmin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function burn(address owner, uint256 id) public {
        require(msg.sender == _admin.getNFTAddress(), "You are not authorized to burn");
        _burn(owner, id, 1);
        ICapsuleData(_admin.getCapsuleDataAddress()).doBurn(id, owner);
    }

    function airdrop(uint8 capsuleType, address dropTo, uint8 units) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        uint256[] memory capsuleIdsMinted = new uint256[](units);

        for(uint8 i =0; i < units; i++) {
            uint256 capsuleId = ICapsuleData(_admin.getCapsuleDataAddress()).getNewCapsuleIdByType(capsuleType, dropTo); 
            _mint(dropTo, capsuleId, 1, "");
            capsuleIdsMinted[i] = capsuleId;
        }
        emit CapsuleMinted(capsuleIdsMinted, msg.sender, 0);
    }

    function claim(uint256[] memory ticketIds, address raffleAddress, address owner) public {
        require(_admin.isValidRaffleAddress(raffleAddress), "Invalid Raffle contract");
        IRaffle _raffleContract = IRaffle(raffleAddress);

        uint256[] memory capsuleIdsMinted = new uint256[](ticketIds.length);

        for(uint256 i = 0; i < ticketIds.length; i++) {
            uint256 ticketId = ticketIds[i];
            
            require(_raffleContract.balanceOf(owner, ticketId) > 0, "Ticket doesn't belong to you");

            (uint8 status, , , uint8 capsuleType) = _raffleContract.getTicketDetail(ticketId);
            require(status == 3, "Ticket is not a winner");

            // require(_capsule_type_to_ids[capsuleType].length > 0, "Capsule not available.");
            uint256 capsuleId = ICapsuleData(_admin.getCapsuleDataAddress()).getNewCapsuleIdByType(capsuleType, owner);

            _mint(owner, capsuleId, 1, "");
            _raffleContract.burn(owner, ticketId);
            
            capsuleIdsMinted[i] = capsuleId;
        }
        emit CapsuleMinted(capsuleIdsMinted, msg.sender, 0);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidCapsuleTransfer(msg.sender, from, to), "Not permitted to transfer");
        ICapsuleData(_admin.getCapsuleDataAddress()).doBurn(id, from);
        ICapsuleData(_admin.getCapsuleDataAddress()).doTransfer(id, to);

        return super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidCapsuleTransfer(msg.sender, from, to), "Not permitted to transfer");

        for(uint256 i =0; i < ids.length; i++){
            uint256 id = ids[i];
            ICapsuleData(_admin.getCapsuleDataAddress()).doBurn(id, from);
            ICapsuleData(_admin.getCapsuleDataAddress()).doTransfer(id, to);
        }

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function extract(address tokenAddress) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");

        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }
        IERC20Contract token = IERC20Contract(tokenAddress);
        require(token.balanceOf(address(this)) > 0, "No balance available");
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }
}
