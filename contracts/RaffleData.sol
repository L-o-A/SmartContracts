// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "./IAdmin.sol";


// contract RaffleData {

//     IAdmin _admin;
//     address _raffle;
//     using Counters for Counters.Counter;
//     Counters.Counter private _ticketCounter;


//     // 0 : yet to start
//     // 1 : Open
//     // 2 : closed
//     // 3 : winners diclared
//     uint8 public _raffle_status;
//     uint256 public _raffle_supply;
//     uint8 public _raffle_type;
//     uint256 public _raffle_start_time;
//     uint256 public _raffle_end_time;

//     uint256[] public _raffle_tickets;
//     mapping(address => uint256) public _raffle_tickets_count;
//     uint256 public _raffle_winner_count;
//     mapping(address => uint256) public _raffle_winning_tickets_count;
//     mapping(address => uint256[]) public _user_tickets;


//     // 0: Not minted
//     // 1: Mintend
//     // 2: Lost Lottery
//     // 3: Won Lottery
//     // 4: Burned
//     mapping(uint256 => uint8) _ticket_status;
//     mapping(uint256 => uint256) _ticket_price;
//     mapping(uint256 => address) _ticket_owner;
//     mapping(address => uint256) public _refund_address_to_amount;
    

//     constructor(address adminContractAddress) {
//         _admin = IAdmin(adminContractAddress);
//     }

//     // Modifier
//     modifier validAdmin() {
//         require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
//         _;
//     }

//     modifier validRaffle() {
//         require(_raffle == msg.sender, "You are not authorized raffle.");
//         _;
//     }

//     function setRaffle(address raffleAddress) public validAdmin {
//         _raffle = raffleAddress;
//     }

//     function getUserTickets(address userAddress) public view returns (uint256[] memory) {
//         return _user_tickets[userAddress];
//     }

//     function getTicketDetail(uint256 id) public view returns (uint8 , uint256, address, uint8) {
//         return (_ticket_status[id], _ticket_price[id], _ticket_owner[id], _raffle_type);
//     }

//     //Admin need to add Raffle ticket before it can be bought or minted
//     function setRaffleInfo( uint8 category, uint256 startTime, uint256 endTime) public validAdmin {
//         require(_raffle_status < 2, "Raffle is already closed.");
//         require(startTime < endTime, "Start time must be less than end time.");

//         _raffle_status = 1;
//         _raffle_type = category;
//         _raffle_start_time = startTime;
//         _raffle_end_time = endTime;
//     }

//     function burn(address owner, uint256 id) public validRaffle {
//         _ticket_status[id] = 4;
//         for(uint256 j = 0; j < _user_tickets[owner].length; j++) {
//             if(_user_tickets[owner][j] == id) {
//                 _user_tickets[owner][j] = _user_tickets[owner][_user_tickets[owner].length - 1];
//                 _user_tickets[owner].pop();
//                 break;
//             }
//         }
//     }

//     function buyTicket(uint256 ticketPrice, uint32 units) public validRaffle returns (uint256[] memory) {
//         uint256[] memory ids = new uint256[](units);

//         for (uint256 i = 0; i < units; i++) {
//             _ticketCounter.increment();
//             uint256 id = _ticketCounter.current();
//             ids[i] = id;
//             _user_tickets[msg.sender].push(id);
         
//             _ticket_price[id] = ticketPrice;
//             _ticket_status[id] = 1;
//             _ticket_owner[id] = msg.sender;

//             _raffle_tickets.push(id);
//         }

//         _raffle_tickets_count[msg.sender] += units;
//         _raffle_supply += units;

//         return ids;
//     }

//     function pickWinner(uint256 count, uint256 rewards) public validRaffle returns (uint256[] memory) {
//         require(_raffle_end_time < block.timestamp, "Raffle event is still open." );
//         require(_raffle_status < 3, "All winners are declared" );
        
//         _raffle_status = 2;
//         uint256[] storage ticketIds = _raffle_tickets;

//         if(count > rewards - _raffle_winner_count) {
//             count = rewards - _raffle_winner_count;
//         }

//         uint256[] memory winners = new uint256[](count);

//         for(uint256 i = 0; i < count; i++) {
//             if(ticketIds.length == 0) break;
//             uint256 selected = random(ticketIds.length);

//             winners[i] = ticketIds[selected];
            
//             _raffle_winning_tickets_count[_ticket_owner[winners[i]]] += 1;

//             _raffle_tickets_count[_ticket_owner[winners[i]]] -= 1;

//             _ticket_status[ticketIds[selected]] = 3;

//             ticketIds[selected] = ticketIds[ticketIds.length - 1];
//             ticketIds.pop();
//         }

//         _raffle_winner_count = _raffle_winner_count + winners.length;

//         if(rewards <= _raffle_winner_count) {
//             _raffle_status = 3;
//         }
//         return winners;
//     }

//     function random(uint256 limit) public view returns (uint16) {
//         return uint16(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, limit)))% limit);
//     }
// }