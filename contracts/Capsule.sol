// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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

interface IERC1155Contract {
    function balanceOf(address tokenOwner, uint256 id) external view returns (uint256);
    function burn(address tokenOwner, uint256 id) external;
    function getTicketDetail(uint256 id) external view returns (uint8 , uint256, address, uint8);
}

interface Admin {
    function isValidAdmin(address adminAddress) external pure returns (bool);
    function getTreasury() external view returns (address);
    function isValidRaffleAddress(address addr) external view returns (bool);
    function isValidCapsuleTransfer(address sender, address from, address to) external view returns (bool);
    function isValidMarketPlaceContract(address sender) external view returns (bool);
    function getCapsuleStakingAddress() external view returns (address) ;
    function getNFTAddress() external view returns (address) ;
    function getMarketAddress() external view returns (address) ;
}

interface ICapsuleStaking {
    function getCapsuleStakeInfo(uint256 id) external view returns (address, uint256, uint256);
}

/**
 * Capsule Contract used for creating Capsule NFT for LOA.
 * It follow ERC1155 standard
 * It mints only 1 instance of 1 NFT type. Each capusule will have uniquie no allocated to it.
 */
contract Capsule is ERC1155, Ownable {

    /**
     * Status values
     */
    // 0 : unpublished
    // 1 : published
    // 2 : owned
    // 3 : staked
    // 4 : unlocked
    // 5 : minted
    // 6 : burned
    mapping(uint256 => uint8) public _capsule_status; //keeps mapping of status of each capsule
    mapping(uint256 => uint8) public _capsule_types; //keeps mapping of type value of each capsule. It is defined while adding data
    mapping(uint256 => uint8) _capsule_level; // keeps mapping of level of each capsule
    mapping(uint8 => uint256[]) _capsule_type_to_ids; // keeps mapping of id list of capsule ids by their type
    mapping(address => uint256[]) _user_holdings;

    Admin _admin;


    event CapsuleMinted(
        uint256[] indexed itemId,
        address indexed buyer,
        uint256 totalPrice
    );

    constructor(address adminContractAddress) ERC1155("https://capsule.leagueofancients.com/api/capsule/{id}.json") {
        _admin = Admin(adminContractAddress);
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }


    function burn(address owner, uint256 id) public {
        require(msg.sender == _admin.getNFTAddress(), "You are not authorized to burn");
        _capsule_status[id] = 6;
        _burn(owner, id, 1);
        for(uint256 j = 0; j <= _user_holdings[owner].length; j++) {
            if(_user_holdings[owner][j] == id) {
                _user_holdings[owner][j] = _user_holdings[owner][_user_holdings[owner].length - 1];
                _user_holdings[owner].pop();
                break;
            }
        }
    }

    function getCapsuleDetail(uint256 id) public view returns (uint8, uint8, uint8, address, uint256, uint256) {
        uint8 level = 0;
        if(_admin.isValidMarketPlaceContract(msg.sender)) 
            level = _capsule_level[id];

        (address owner, uint256 endtime, uint256 amount) = ICapsuleStaking(_admin.getCapsuleStakingAddress()).getCapsuleStakeInfo(id);
        return (_capsule_types[id], level, _capsule_status[id], owner, endtime, amount);
    }

    function getUserCapsules(address owner) public view returns (uint256[] memory) {
        return _user_holdings[owner];
    }

    /*
     * Put Capsule details which can be minted later.
     * User cant mint a capsule if not added to inventory.
     * It consumes of array of values which provides various attributes of a capsule diffentiated via index.
     */
    function modifyCapsules(
        bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory types
    ) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        if(add) {
            require(ids.length ==  levels.length && levels.length == types.length , "Args length not matching");
            
            for (uint256 i = 0; i < ids.length; i++) {
                require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
                if(_capsule_status[ids[i]] == 0) {
                    _capsule_type_to_ids[types[i]].push(ids[i]);
                }
                _capsule_status[ids[i]] = 1;
                _capsule_level[ids[i]] = levels[i];
                _capsule_types[ids[i]] = types[i];
            }
        } else {

            for (uint256 i = 0; i < ids.length; i++) {
                require(_capsule_status[ids[i]] < 2, "Id is already consumed.");
                if(_capsule_status[ids[i]] == 0) {
                    uint256[] storage cids = _capsule_type_to_ids[_capsule_types[ids[i]]];
                    for(uint256 j = 0; j < cids.length; j++) {
                        if(cids[j] == ids[i]) {
                            cids[j] = cids[cids.length -1];
                            cids.pop();
                            break;
                        }
                    }
                }
                delete _capsule_status[ids[i]];
                delete _capsule_level[ids[i]];
                delete _capsule_types[ids[i]];
            }
        }
    }

    function airdrop(uint8 capsuleType, address dropTo, uint8 units) public {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");

        require(_capsule_type_to_ids[capsuleType].length > 0, "Capsule not available.");

        uint256[] memory capsuleIdsMinted = new uint256[](units);

        for(uint8 i =0; i < units; i++) {
            uint256 capsuleId = _capsule_type_to_ids[capsuleType][_capsule_type_to_ids[capsuleType].length -1];

            // require(_capsule_status[capsuleId] == 1, "Capsule is not available");

            _capsule_status[capsuleId] = 2;
            _mint(dropTo, capsuleId, 1, "");
            _user_holdings[dropTo].push(capsuleId);
            
            _capsule_type_to_ids[_capsule_types[capsuleId]].pop();
            capsuleIdsMinted[i] = capsuleId;
        }
        emit CapsuleMinted(capsuleIdsMinted, msg.sender, 0);
    }

    function claim(uint256[] memory ticketIds, address raffleAddress, address owner) public {
        require(_admin.isValidRaffleAddress(raffleAddress), "Invalid Raffle contract");
        IERC1155Contract _raffleContract = IERC1155Contract(raffleAddress);

        uint256[] memory capsuleIdsMinted = new uint256[](ticketIds.length);

        for(uint256 i = 0; i < ticketIds.length; i++) {
            uint256 ticketId = ticketIds[i];
            
            require(_raffleContract.balanceOf(owner, ticketId) > 0, "Ticket doesn't belong to you");

            (uint8 status, , , uint8 capsuleType) = _raffleContract.getTicketDetail(ticketId);
            require(status == 3, "Ticket is not a winner");

            require(_capsule_type_to_ids[capsuleType].length > 0, "Capsule not available.");
            uint256 capsuleId = _capsule_type_to_ids[capsuleType][_capsule_type_to_ids[capsuleType].length -1];

            require(_capsule_status[capsuleId] == 1, "id is not available");

            _capsule_status[capsuleId] = 2;

            _mint(owner, capsuleId, 1, "");
            _user_holdings[owner].push(capsuleId);
            _raffleContract.burn(owner, ticketId);
            
            _capsule_type_to_ids[_capsule_types[capsuleId]].pop();
            capsuleIdsMinted[i] = capsuleId;
        }
        emit CapsuleMinted(capsuleIdsMinted, msg.sender, 0);
    }

    function markStatus(uint256 capsuleId, bool vested, bool unlocked, bool unstaked) public  {
        require(_admin.getCapsuleStakingAddress() == msg.sender, "You are not authorized.");
        if(vested) {
            require(_capsule_status[capsuleId] == 2, "Token is not allocated.");
            _capsule_status[capsuleId] = 3;
        }
        else if(unlocked) {
            require(_capsule_status[capsuleId] == 3, "Token is not vested.");
            _capsule_status[capsuleId] = 4;
        }
        else if(unstaked) {
            require(_capsule_status[capsuleId] == 3, "Token is not vested.");
            _capsule_status[capsuleId] = 2;
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidCapsuleTransfer(msg.sender, from, to), "Not permitted to transfer");
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
