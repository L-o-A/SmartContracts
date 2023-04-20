// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./IAdmin.sol";

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
    function calcPrice(uint32 units, uint256 currentSupply) external view returns (uint256);
    function getCurrentRewards(uint256 _raffle_supply) external pure returns (uint64);
}

interface CapsuleInterface {
    function claim(uint256[] memory ticketIds, address raffleAddress, address receiver) external;
}

interface ILOAUtil {
    function randomNumber(address requestor) external returns (uint256);
}


contract Raffle {

    address _loaContract;
    Helper _helper;
    using Counters for Counters.Counter;
    Counters.Counter private _ticketCounter;

    // 0 : yet to start
    // 1 : Open
    // 2 : closed
    // 3 : winners diclared
    // 4 : terminated
    uint8 public _raffle_status;
    uint256 public _raffle_supply;
    uint8 public _raffle_type;
    uint256 public _raffle_start_time;
    uint256 public _raffle_end_time;
    uint256 public _raffle_closure_time;


    uint256[] public _raffle_tickets;
    mapping(address => uint256) public _raffle_tickets_count;
    uint256 public _raffle_winner_count;
    mapping(address => uint256) public _raffle_winning_tickets_count;
    mapping(address => uint256[]) public _user_winning_tickets;
    mapping(address => uint256[]) public _user_tickets;
    mapping(address => mapping(uint256 => uint256)) public _user_tickets_id_to_index;
    mapping(address => mapping(uint256 => uint256)) public _user_winning_tickets_id_to_index;
    mapping(address => uint256) public _user_ticket_prices;
    mapping(address => mapping(uint256 => uint8)) public _user_ticket_balance;


    // 0: Not minted
    // 1: Mintend
    // 2: Lost Lottery
    // 3: Won Lottery
    // 4: Burned
    mapping(uint256 => uint8) _ticket_status;
    mapping(uint256 => uint256) _ticket_price;
    mapping(uint256 => address) _ticket_owner;
    mapping(address => uint256) public _refund_address_to_amount;
    uint256 public _total_loa_staked;

    IAdmin _admin;

    event TicketMinted(
        uint256 indexed units,
        address indexed buyer,
        uint256 totalPrice
    );

    event WinnersDeclared(
        uint256[] ticketIds
    );

    constructor(address loaContract, address raffleHelper, address admin) {
        _helper = Helper(raffleHelper);
        _loaContract = loaContract;
        _admin = IAdmin(admin);
    }

    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender) , "You are not authorized.");
        _;
    }

    function getTicketDetail(uint256 id) public view returns (uint8 , uint256, address, uint8) {
        return (_ticket_status[id], _ticket_price[id], _ticket_owner[id], _raffle_type);
    }

    function getUserTickets(address userAddress) public view returns (uint256[] memory) {
        return _user_tickets[userAddress];
    }

    function getUserWinningTickets(address userAddress) public view returns (uint256[] memory) {
        return _user_winning_tickets[userAddress];
    }

    function balanceOf(address tokenOwner, uint256 id) public view returns (uint256) {
        return _user_ticket_balance[tokenOwner][id];
    }

    function burn(address owner, uint256 id) public payable {
        
        require(msg.sender == _admin.getCapsuleAddress(), "You are not authorized to burn");
        require(_raffle_status != 4, "Raffle is terminated");

        _ticket_status[id] = 4;
        uint256 index = _user_tickets_id_to_index[owner][id];

        _user_tickets[owner][index] = _user_tickets[owner][_user_tickets[owner].length - 1];
        _user_tickets_id_to_index[owner][_user_tickets[owner][_user_tickets[owner].length - 1]] = index;

        index = _user_winning_tickets_id_to_index[owner][id];
        _user_winning_tickets[owner][index] = _user_winning_tickets[owner][_user_winning_tickets[owner].length - 1];
        _user_winning_tickets_id_to_index[owner][_user_winning_tickets[owner][index]] = index;

        _user_tickets[owner].pop();
        _user_winning_tickets[owner].pop();
        delete _user_tickets_id_to_index[owner][id];
        delete _user_winning_tickets_id_to_index[owner][id];

        delete _user_ticket_balance[owner][id];
    }
    

    //Admin need to add Raffle ticket before it can be bought or minted, even when its open
    function setRaffleInfo(
        uint8 category,
        uint256 start_time,
        uint256 end_time,
        uint256 closure_time
    ) public validAdmin {
        require(_raffle_status < 2, "Raffle is already closed.");
        require(start_time < end_time, "Start time must be less than end time.");
        require(end_time < closure_time, "End time must be less than closure time.");

        _raffle_status = 1;
        _raffle_type = category;
        _raffle_start_time = start_time;
        _raffle_end_time = end_time;
        _raffle_closure_time = closure_time;
    }

    // User can buy raffle ticket by providing raffileType and no of units
    function buyTicket(uint32 units) public payable {

        require(_raffle_status == 1, "Raffle is not open." );
        require(_raffle_start_time < block.timestamp, "Raffle is not open." );
        require(_raffle_end_time > block.timestamp, "Raffle is closed." );
        require(units > 0, "Invalid units provided." );

        uint256 amount = _helper.calcPrice(units, _raffle_supply);

        require( IERC20Contract(_loaContract).balanceOf(msg.sender) >= amount, "Required LOA balance is not available.");

        IERC20Contract(_loaContract).transferFrom(msg.sender, address(this), amount);
        
        _total_loa_staked += amount;

        uint256 ticketPrice = amount / units;

        for (uint256 i = 0; i < units; i++) {
            _ticketCounter.increment();
            uint256 id = _ticketCounter.current();
            _user_ticket_balance[msg.sender][id] = 1;
            _user_tickets[msg.sender].push(id);
            _user_tickets_id_to_index[msg.sender][id] = _user_tickets[msg.sender].length - 1;
            _user_ticket_prices[msg.sender] += ticketPrice;
         
            _ticket_price[id] = ticketPrice;
            _ticket_status[id] = 1;
            _ticket_owner[id] = msg.sender;

            _raffle_tickets.push(id);
        }

        _raffle_tickets_count[msg.sender] += units;
        _raffle_supply += units;
    
        emit TicketMinted(units, msg.sender, amount);
    }

    function pickWinner(uint256 count) public validAdmin {
        require(_raffle_end_time < block.timestamp, "Raffle event is still open." );
        require(_raffle_status < 3, "All winners are declared" );
        
        _raffle_status = 2;
        uint256[] storage ticketIds = _raffle_tickets;

        uint64 rewards = _helper.getCurrentRewards(_raffle_supply);
        if(count > rewards - _raffle_winner_count) {
            count = rewards - _raffle_winner_count;
        }

        uint256[] memory winners = new uint256[](count);
        uint256 winnerFees = 0;

        for(uint256 i = 0; i < count; i++) {
            if(ticketIds.length == 0) break;

            uint256 selected = ILOAUtil(_admin.getUtilAddress()).randomNumber(msg.sender) % (ticketIds.length);

            winners[i] = ticketIds[selected];
            winnerFees += _ticket_price[winners[i]];
            _user_ticket_prices[_ticket_owner[winners[i]]] -= _ticket_price[winners[i]];

            _raffle_winning_tickets_count[_ticket_owner[winners[i]]] += 1;
            _user_winning_tickets[_ticket_owner[winners[i]]].push(winners[i]);
            _user_winning_tickets_id_to_index[_ticket_owner[winners[i]]][winners[i]] = _user_winning_tickets[_ticket_owner[winners[i]]].length-1;

            _raffle_tickets_count[_ticket_owner[winners[i]]] -= 1;

            _ticket_status[ticketIds[selected]] = 3;

            ticketIds[selected] = ticketIds[ticketIds.length - 1];
            ticketIds.pop();
        }

        _raffle_winner_count = _raffle_winner_count + winners.length;
        _total_loa_staked -= winnerFees;
        IERC20Contract(_loaContract).transfer(_admin.getTreasury(), winnerFees);

        if(rewards <= _raffle_winner_count) {
            _raffle_status = 3;
        }
        emit WinnersDeclared(winners);
    }

    function terminate() public validAdmin {
        require(block.timestamp >=  _raffle_closure_time, "Raffale not expired");
        require(_raffle_status != 4, "Raffle is terminated");
        _raffle_status = 4;
        payable(_admin.getTreasury()).transfer(address(this).balance);
        IERC20Contract(_loaContract).transfer(_admin.getTreasury(), IERC20Contract(_loaContract).balanceOf(address(this)));
    }

    function withdraw(address tokenAddress) public {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }
        if(_raffle_status == 3){
            if(_user_winning_tickets[msg.sender].length == 0){
                cleanup();
            } else if(_user_winning_tickets[msg.sender].length > 30){
                uint256[] memory selected = new uint256[](30);
                for (uint256 i = 0; i < 30; i++) {
                    selected[i] = _user_winning_tickets[msg.sender][i];
                }
                CapsuleInterface(_admin.getCapsuleAddress()).claim(selected, address(this), msg.sender);
            } else {
                CapsuleInterface(_admin.getCapsuleAddress()).claim(_user_winning_tickets[msg.sender], address(this), msg.sender);
            }
        }
        if(_refund_address_to_amount[msg.sender] > 0) {
            require( IERC20Contract(_loaContract).balanceOf(address(this)) >= _refund_address_to_amount[msg.sender], "Low tresury balance");
            IERC20Contract(_loaContract).transfer(msg.sender, _refund_address_to_amount[msg.sender]);
            _total_loa_staked -= _refund_address_to_amount[msg.sender];
            delete _refund_address_to_amount[msg.sender];
        }
        if(_admin.isValidAdmin(msg.sender)) {
            IERC20Contract(tokenAddress).transfer(_admin.getTreasury(), IERC20Contract(tokenAddress).balanceOf(address(this)) - _total_loa_staked);
        }
    }

    function cleanup() public {
        if(_raffle_status == 3) {
            uint256[] storage ticketIds = _user_tickets[msg.sender];
            if(ticketIds.length > 0){
                uint256 loop_end = ticketIds.length > 50 ? (ticketIds.length - 50) : 0;
                for(uint256 j = ticketIds.length ; j > loop_end; j--) {

                    if(_ticket_status[ticketIds[j-1]] != 3) {
                        _ticket_status[ticketIds[j-1]] = 2;
                        _user_ticket_prices[msg.sender] -= _ticket_price[ticketIds[j-1]];
                        _refund_address_to_amount[msg.sender] += _ticket_price[ticketIds[j-1]];
                        _raffle_tickets_count[msg.sender]--;
                        delete _user_ticket_balance[msg.sender][ticketIds[j-1]];
                        delete _user_tickets_id_to_index[msg.sender][ticketIds[j-1]];
                        _user_tickets[msg.sender].pop();
                    }
                }
            }
        }
    }
}
