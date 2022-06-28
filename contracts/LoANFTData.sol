// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./IAdmin.sol";

// import "hardhat/console.sol";

contract LoANFTData {
    // 0 : unpublished
    // 1 : ready to mint
    // 2 : minted
    // 3 : burned
    mapping(uint256 => uint8) public _nft_status;
    mapping(uint256 => uint8) _nft_level;
    mapping(uint256 => uint8) _nft_hero;
    mapping(uint256 => address) _nft_owner;

    mapping(uint8 => uint256[]) _nft_level_to_ids;
    mapping(uint8 => uint256) public _minting_fee;
    mapping(address => uint256[]) _user_holdings;

    string public _nft_attribute_names;
    mapping(uint256 => string) _nft_attributes;
    mapping(address => uint8) _axionAddresses; // Axion Contract

    IAdmin _admin;

    event NFTMinted(
        uint256 indexed itemIds,
        uint256 indexed capsuleIds,
        address indexed buyer,
        uint256 price
    );

    constructor(address adminContractAddress) {
        _admin = IAdmin(adminContractAddress);
    }

    function updateFees(uint8[] memory capsuleTypes, uint256[] memory fees)
        public
        validAdmin
    {
        require(capsuleTypes.length == fees.length, "args length must match");
        for (uint8 i = 0; i < capsuleTypes.length; i++) {
            _minting_fee[capsuleTypes[i]] = fees[i];
        }
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function getNFTDetail(uint256 id)
        public
        view
        returns (
            uint8,
            uint8,
            address,
            uint8,
            string memory
        )
    {
        if (msg.sender != _admin.getNFTDataAddress())
            require(_nft_status[id] == 2, "Id is not minted");
        string memory attributes = "";
        if(_nft_status[id] == 2) {
            attributes = getNFTAttributes(id);
        }
        return (_nft_hero[id], _nft_level[id], _nft_owner[id], _nft_status[id], attributes);
    }

    function getUserNFTs(address sender) public view returns (uint256[] memory) {
        return _user_holdings[sender];
    }

    function modifyNFTs(
        bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory heroes,
        uint256[] memory startTimes
    ) public validAdmin {
        if (add) {
            require(
                ids.length == levels.length &&
                    levels.length == heroes.length &&
                    heroes.length == startTimes.length,
                "Args length not matching"
            );

            for (uint256 i = 0; i < ids.length; i++) {
                require(_nft_status[ids[i]] == 0, "Id is already published");
                if (_nft_status[ids[i]] == 0)
                    _nft_level_to_ids[levels[i]].push(ids[i]);

                _nft_status[ids[i]] = 1;
                _nft_level[ids[i]] = levels[i];
                _nft_hero[ids[i]] = heroes[i];
            }
        } else {
            for (uint256 i = 0; i < ids.length; i++) {
                require(
                    _nft_status[ids[i]] == 0 || _nft_status[ids[i]] == 1,
                    "Id is already consumed."
                );
                if (_nft_status[ids[i]] == 0) {
                    uint256[] storage cids = _nft_level_to_ids[
                        _nft_level[ids[i]]
                    ];
                    for (uint256 j = 0; j < cids.length; j++) {
                        if (cids[j] == ids[i]) {
                            cids[j] = cids[cids.length - 1];
                            cids.pop();
                            break;
                        }
                    }
                }
                delete _nft_status[ids[i]];
                delete _nft_level[ids[i]];
                delete _nft_hero[ids[i]];
            }
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        
        for (uint256 j = 0; j < _user_holdings[from].length; j++) {
            if (_user_holdings[from][j] == id) {
                _user_holdings[from][j] = _user_holdings[from][
                    _user_holdings[from].length - 1
                ];
                _user_holdings[from].pop();
                break;
            }
        }
        _user_holdings[to].push(id);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids
    ) public {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");
        for(uint256 i =0; i < ids.length; i++){
            uint256 id = ids[i];
            for (uint256 j = 0; j < _user_holdings[from].length; j++) {
                if (_user_holdings[from][j] == id) {
                    _user_holdings[from][j] = _user_holdings[from][
                        _user_holdings[from].length - 1
                    ];
                    _user_holdings[from].pop();
                    break;
                }
            }
            _user_holdings[to].push(id);
        }
    }

    function fusion(
        address owner,
        uint256[] memory ids,
        uint8 fusionLevel
    ) public returns (uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");

        for (uint8 i = 0; i < ids.length; i++) {
            for (uint256 j = 0; j < _user_holdings[owner].length; j++) {
                if (_user_holdings[owner][j] == ids[i]) {
                    _user_holdings[owner][j] = _user_holdings[owner][
                        _user_holdings[owner].length - 1
                    ];
                    _user_holdings[owner].pop();
                    break;
                }
            }
        }

        uint256 id = _nft_level_to_ids[fusionLevel][
            _nft_level_to_ids[fusionLevel].length - 1
        ];
        require(_nft_status[id] == 1, "id is not available");

        _nft_owner[id] = owner;
        _nft_status[id] = 2;

        _user_holdings[owner].push(id);
        _nft_level_to_ids[_nft_level[id]].pop();

        return id;
    }

    function mint(uint8 capsuleLevel) public returns (uint256, uint256) {
        require(msg.sender == _admin.getNFTAddress(), "Not authorized to transfer");

        uint256 id = _nft_level_to_ids[capsuleLevel][_nft_level_to_ids[capsuleLevel].length - 1];
        require(_nft_status[id] == 1, "id is not available");

        uint256 fee = _minting_fee[capsuleLevel];
       

        _nft_owner[id] = msg.sender;
        _nft_status[id] = 2;
        _user_holdings[msg.sender].push(id);
        _nft_level_to_ids[_nft_level[id]].pop();

        return (id, fee);
    }

    function modifyAxionAddresses(address axionAddress, bool add) public validAdmin {
        if(add)
            _axionAddresses[axionAddress] = 1;
        else
            delete _axionAddresses[axionAddress];
    }

    function modifyProperty(uint256 id, string memory newProperties) public {
        require(_axionAddresses[msg.sender] == 1, "Not authorized axion contract");
        _nft_attributes[id] = newProperties;
    }

    function getNFTAttributes(uint256 id) public view returns (string memory) {
        require(_admin.isValidMarketPlaceContract(msg.sender), "Not authorized");
        return (_nft_attributes[id]);
    }

    function putNFTAttributeNames (string memory nft_attribute_names) public validAdmin {
        _nft_attribute_names = nft_attribute_names;
    }

    function putNFTAttributes (uint256[] memory ids, string[] memory attribs) public validAdmin {
        require(ids.length ==  attribs.length, "Args length not matching");
        for (uint256 i = 0; i < ids.length; i++) {
            require(_nft_status[ids[i]] == 1, "Id is not published");
            _nft_attributes[ids[i]] = attribs[i];
        }
    }

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        ERC20 token = ERC20(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }
}
