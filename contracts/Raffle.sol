// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

/**
    Raffale contract is kind of lottery contract, where user can stake LOA token for one or multiple Raffle tickets.
    After tickets are allocated, then user can open those tickets to find if they have own capsule token or not. Anyone who doesnt won capsule after opening ticket, will get his staked LOA in his account.
    User can open capsule token to get NFT.

    Rules:

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
    function getType(uint256 id) external view returns (uint8);
}


contract Raffle is ERC1155, Ownable {

    IERC20Contract public _erc20Token;
    address private _admin;
    address private _capsuleAddress;
    using Counters for Counters.Counter;
    Counters.Counter private _ticketCounter;

    // 0 : yet to start
    // 1 : Open
    // 2 : closed
    // 3 : winners diclared
    mapping(uint256 => uint8) public _raffle_status;
    mapping(uint256 => uint256) public _raffle_price;
    mapping(uint256 => uint8) public _raffle_type;
    mapping(uint256 => uint16) public _raffle_capsule_count;
    mapping(uint256 => uint256) public _raffle_start_time;
    mapping(uint256 => uint256) public _raffle_end_time;


    mapping(uint256 => uint256[]) public _raffle_tickets;


    // 0: Not minted
    // 1: Mintend
    // 2: Lost Lottery
    // 3: Won Lottery
    // 4: Burned
    mapping(uint256 => uint8) public _ticket_status;
    mapping(uint256 => uint256) public _ticket_raffle_id;
    mapping(uint256 => uint256) public _ticket_price;
    mapping(uint256 => address) public _ticket_owner;
    mapping(address => uint256) public _refund_address_to_amount;


    event TicketMinted(
        uint256 indexed raffleId,
        uint256 indexed units,
        address indexed buyer,
        uint256 totalPrice
    );

    event WinnersDeclared(
        uint256 indexed raffleId,
        uint256[] ticketIds
    );

    constructor(address erc20Contract) 
        ERC1155("https://ticket.leagueofancients.com/api/ticket/{id}.json") {
        _admin = msg.sender;
        _erc20Token = IERC20Contract(erc20Contract);
    }

    // Modifier
    modifier onlyAdmin() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function setCapsuleAddress(address capsuleAddress) public onlyAdmin{
        _capsuleAddress = capsuleAddress;
    }

    function burn(address owner, uint256 id) public payable {
        require(msg.sender == _capsuleAddress, "You are not authorized to burn");
        _ticket_status[id] = 4;
        _burn(owner, id, 1);
    }


    // function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        
    //     safeTransferFrom(from, to, id, amount, data);
    // }


    function isWinner(uint256 id) public view returns(bool) {
        return _ticket_status[id] == 3;
    }

    function getType(uint256 id) public view returns(uint8) {
        return  _raffle_type[_ticket_raffle_id[id]];
    }

    function putRaffle(
        uint256 id,
        uint256 price,
        uint8 category,
        uint16 capsuleCount,
        uint256 startTime,
        uint256 endTime
    ) public onlyAdmin {
        require(id > 0, "Id should be greater than zero");
        require(_raffle_status[id] < 2, "Id is already consumed.");
        require(price > 0, "Price must not be zero.");
        require(capsuleCount > 0, "Winning tickets must not be zero.");
        require(startTime < endTime, "Start time must be less than end time.");

        _raffle_status[id] = 1;
        _raffle_price[id] = price;
        _raffle_type[id] = category;
        _raffle_capsule_count[id] = capsuleCount;
        _raffle_start_time[id] = startTime;
        _raffle_end_time[id] = endTime;

    }


    function removeRaffle(uint256 id) public onlyAdmin {

        require(_raffle_status[id] < 2, "Id is already closed.");

        delete _raffle_status[id];
        delete _raffle_price[id];
        delete _raffle_type[id];
        delete _raffle_tickets[id];
        delete _raffle_start_time[id];
        delete _raffle_end_time[id];
    }

    function buyTicket(uint256 raffleId, uint32 units) public payable {

        require(_raffle_status[raffleId] == 1, "Raffle is not open." );
        require(_raffle_start_time[raffleId] < block.timestamp, "Raffle is not open." );
        require(_raffle_end_time[raffleId] > block.timestamp, "Raffle is not open." );
        require(units > 1, "Invalid units provided." );

        require(
            _erc20Token.balanceOf(msg.sender) >= _raffle_price[raffleId] * units,
            "Required LOA balance is not available."
        );

        _erc20Token.transferFrom(msg.sender, address(this), _raffle_price[raffleId] * units);

        for (uint256 i = 0; i < units; i++) {
            _ticketCounter.increment();
            uint256 id = _ticketCounter.current();
            _mint(msg.sender, id, 1, "");
         
            _ticket_price[id] = _raffle_price[raffleId];
            _ticket_status[id] = 1;
            _ticket_raffle_id[id] = raffleId;
            _ticket_owner[id] = msg.sender;

            _raffle_tickets[raffleId].push(id);
        }
    
        emit TicketMinted(raffleId, units, msg.sender, _raffle_price[raffleId] * units);
    }


    function pickWinner(uint256 raffleId) public onlyAdmin {
        require(_raffle_end_time[raffleId] < block.timestamp, "Raffle event is still open." );
        require(_raffle_status[raffleId] == 1 
                || _raffle_status[raffleId] == 2, 
                "Raffle event is still open." );

        uint256[] storage ticketIds = _raffle_tickets[raffleId];
        uint256[] memory winners = new uint256[](_raffle_capsule_count[raffleId]);

        for(uint256 i = 0; i < _raffle_capsule_count[raffleId]; i++) {
            if(ticketIds.length == 0) break;
            uint256 selected = random(ticketIds.length);

            winners[i] = ticketIds[selected];
            _refund_address_to_amount[_admin] += _ticket_price[ticketIds[selected]];
            _ticket_status[ticketIds[selected]] = 3;

            console.log("winner: " , winners[i]);
            ticketIds[selected] = ticketIds[ticketIds.length - 1];
            ticketIds.pop();
        }

        for(uint256 i = 0; i < ticketIds.length; i++) {
            _ticket_status[ticketIds[i]] = 2;
            _refund_address_to_amount[_ticket_owner[ticketIds[i]]] += _ticket_price[ticketIds[i]];
            _burn(_ticket_owner[ticketIds[i]], ticketIds[i], 1);
        }

        _raffle_status[raffleId] = 3;
        emit WinnersDeclared(raffleId, winners);
    }

    function random(uint256 limit) private view returns (uint16) {
        return uint16(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, limit)))% limit);
    }

    function withdraw() public {
        uint256 balance = _refund_address_to_amount[msg.sender];
        require(balance > 0, "Low balance");
        require( _erc20Token.balanceOf(address(this)) >= balance, "Low tresury balance");
        _erc20Token.transfer(msg.sender, balance);
    }
}
