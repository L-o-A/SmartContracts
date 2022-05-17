// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";


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

interface Helper {
    function calcPrice(uint32 units, uint256 currentSupply, uint256[] memory _raffle_supply_range, uint256[] memory _raffle_price_range) external view returns (uint256);
    function random(uint256 limit) external view returns (uint16) ;
}


contract Raffle is ERC1155, Ownable {

    IERC20Contract public _loaContract;
    Helper public _helper;
    address private _admin;
    address private _capsuleAddress;
    using Counters for Counters.Counter;
    Counters.Counter private _ticketCounter;

    // 0 : yet to start
    // 1 : Open
    // 2 : closed
    // 3 : winners diclared
    uint8 public _raffle_status;
    // mapping(uint256 => uint256) public _raffle_price;
    uint256 public _raffle_supply;
    uint256[] public _raffle_supply_range;
    uint256[] public _raffle_price_range;
    uint256[] public _reward_range;
    uint64[] public _reward_amount;
    uint8 public _raffle_type;
    // uint16 public _raffle_capsule_per_tickets;
    uint256 public _raffle_start_time;
    uint256 public _raffle_end_time;


    uint256[] public _raffle_tickets;
    mapping(address => uint256) public _raffle_tickets_count;
    uint256 public _raffle_winner_count;
    mapping(address => uint256) public _raffle_winning_tickets_count;
    // mapping(address => uint256[]) public _raffle_won_tickets;


    // 0: Not minted
    // 1: Mintend
    // 2: Lost Lottery
    // 3: Won Lottery
    // 4: Burned
    mapping(uint256 => uint8) public _ticket_status;
    mapping(uint256 => uint256) public _ticket_price;
    mapping(uint256 => address) public _ticket_owner;
    mapping(address => uint256) public _refund_address_to_amount;


    // event TicketMinted(
    //     uint256 indexed units,
    //     address indexed buyer,
    //     uint256 totalPrice
    // );

    event WinnersDeclared(
        uint256[] ticketIds
    );

    constructor(address loaContract) 
        ERC1155("https://ticket.leagueofancients.com/api/ticket/{id}.json") {
        _admin = msg.sender;
        _loaContract = IERC20Contract(loaContract);
    }

    // Modifier
    modifier onlyAdmin() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function burn(address owner, uint256 id) public payable {
        require(msg.sender == _capsuleAddress, "You are not authorized to burn");

        _ticket_status[id] = 4;
        _burn(owner, id, 1);
    }


    // function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
    //     safeTransferFrom(from, to, id, amount, data);
    // }


    //Admin need to add Raffle ticket before it can be bought or minted
    function putRaffle(
        uint8 category,
        uint256 startTime,
        uint256 endTime,
        uint256[] memory reward_range,
        uint64[] memory reward_amount,
        address capsuleAddress, 
        address raffleHelper
    ) public onlyAdmin {
        require(_raffle_status < 2, "Raffle is already closed.");
        require(startTime < endTime, "Start time must be less than end time.");
        require(reward_range.length + 1 == reward_amount.length, "Data length is incorrected.");

        _raffle_status = 1;
        _raffle_type = category;
        _raffle_start_time = startTime;
        _raffle_end_time = endTime;

        delete _reward_range;
        delete _reward_amount;

        _reward_range = reward_range;
        _reward_amount = reward_amount;
        // for(uint256 i = 0; i < _reward_range.length; i++) {
        //     _reward_range.pop();
        //     _reward_amount.pop();
        // }
        // if(_reward_amount.length > 0)
        //     _reward_amount.pop();
        // for(uint256 i = 0; i < reward_range.length; i++) {
        //     if(i > 0) {
        //         require(reward_range[i] > reward_range[i - 1], "Data provided should be in ascending order.");
        //     }
        //     _reward_range.push(reward_range[i]);
        //     _reward_amount.push(reward_amount[i]);
        // }
        // _reward_amount.push(reward_amount[reward_amount.length - 1]);


        _capsuleAddress = capsuleAddress;
        _helper = Helper(raffleHelper);
    }


    //Admin need to add Raffle ticket before it can be bought or minted
    function putRafflePrices(
        uint256[] memory supply,
        uint256[] memory prices
    ) public onlyAdmin {
        require(_raffle_status < 2, "Raffle is already closed.");
        require(supply.length + 1 == prices.length, "Data length is incorrected.");

        delete _raffle_supply_range;
        delete _raffle_price_range;

        for(uint256 i = 0; i < supply.length; i++) {
            if(i > 0) {
                require(supply[i] > supply[i - 1], "Data provided should be in ascending order.");
            }
        }

        _raffle_supply_range = supply;
        _raffle_price_range = prices;
    }

    function calcPrice(uint32 units) public view returns(uint256) {
        return _helper.calcPrice(units, _raffle_supply, _raffle_supply_range, _raffle_price_range);
    }


    // User can buy raffle ticket by providing raffileType and no of units
    function buyTicket(uint32 units) public payable {

        require(_raffle_status == 1, "Raffle is not open." );
        require(_raffle_start_time < block.timestamp, "Raffle is not open." );
        require(_raffle_end_time > block.timestamp, "Raffle is not open." );
        require(units > 1, "Invalid units provided." );

        uint256 amount = calcPrice(units);

        require( _loaContract.balanceOf(msg.sender) >= amount, "Required LOA balance is not available.");

        _loaContract.transferFrom(msg.sender, address(this), amount);

        uint256 ticketPrice = amount / units;

        for (uint256 i = 0; i < units; i++) {
            _ticketCounter.increment();
            uint256 id = _ticketCounter.current();
            _mint(msg.sender, id, 1, "");
         
            _ticket_price[id] = ticketPrice;
            _ticket_status[id] = 1;
            _ticket_owner[id] = msg.sender;

            _raffle_tickets.push(id);
        }

        _raffle_tickets_count[msg.sender] += units;
        _raffle_supply += units;
    
        // emit TicketMinted(raffleId, units, msg.sender, amount);
    }

    function getCurrentRewards() public view returns (uint64) {
        uint64 rewards = _reward_amount[_reward_amount.length -1];
        // console.log('rewards full :', rewards);
        for(uint i = 0; i < _reward_range.length; i++) {
            if(_raffle_supply < _reward_range[i]) {
                rewards = _reward_amount[i];
                break;
            }
        }
        return rewards;
    }


    function pickWinner(uint256 count) public onlyAdmin {
        require(_raffle_end_time < block.timestamp, "Raffle event is still open." );
        require(_raffle_status < 3, "All winners are declared" );
        
        _raffle_status = 2;
        uint256[] storage ticketIds = _raffle_tickets;

        uint64 rewards = getCurrentRewards();

        // console.log('rewards :', rewards);
        
        if(count > rewards - _raffle_winner_count) {
            count = rewards - _raffle_winner_count;
        }

        uint256[] memory winners = new uint256[](count);

        for(uint256 i = 0; i < count; i++) {
            if(ticketIds.length == 0) break;
            uint256 selected = _helper.random(ticketIds.length);

            winners[i] = ticketIds[selected];
            
            _raffle_winning_tickets_count[_ticket_owner[winners[i]]] += 1;
            // _raffle_won_tickets[_ticket_owner[winners[i]]].push(winners[i]);

            _raffle_tickets_count[_ticket_owner[winners[i]]] -= 1;

            _ticket_status[ticketIds[selected]] = 3;

            ticketIds[selected] = ticketIds[ticketIds.length - 1];
            ticketIds.pop();
        }

        _raffle_winner_count = _raffle_winner_count + winners.length;

        if(rewards <= _raffle_winner_count) {
                _raffle_status = 3;
            
            for(uint256 i = 0; i < ticketIds.length; i++) {
                _ticket_status[ticketIds[i]] = 2;
                _refund_address_to_amount[_ticket_owner[ticketIds[i]]] += _ticket_price[ticketIds[i]];
                _raffle_tickets_count[_ticket_owner[ticketIds[i]]] = 0;
                _burn(_ticket_owner[ticketIds[i]], ticketIds[i], 1);
            }
        }
        
        emit WinnersDeclared(winners);
    }


    function withdraw() public {
        uint256 balance = _refund_address_to_amount[msg.sender];
        require(balance > 0, "Low balance");
        require( _loaContract.balanceOf(address(this)) >= balance, "Low tresury balance");
        _loaContract.transfer(msg.sender, balance);
    }

}
