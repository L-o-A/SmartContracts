// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";

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
    function balanceOf(address tokenOwner, uint256 id)
        external
        view
        returns (uint256);

    function burn(address tokenOwner, uint256 id) external;

    function getCapsuleDetail(uint256 id)
        external
        view
        returns (
            uint8,
            uint8,
            uint8, address, uint256, uint256
        );
}

interface Admin {
    function isValidAdmin(address adminAddress) external pure returns (bool);

    function getTreasury() external view returns (address);

    function isValidRaffleAddress(address addr) external view returns (bool);

    function isValidCapsuleTransfer(
        address sender,
        address from,
        address to
    ) external view returns (bool);

    function isValidMarketPlaceContract(address sender)
        external
        view
        returns (bool);

    function getMarketAddress() external view returns (address);

    function getFusionAddress() external view returns (address);

    function getAxionAddress() external view returns (address);

    function getCapsuleAddress() external view returns (address);

    function getNFTAttributeAddress() external view returns (address);

    function getNFTAddress() external view returns (address);
}

interface INFTAttribute {
    function getNFTAttributes(uint256 id) external view returns (string memory);
}

contract LoANFT is ERC1155, Ownable {
    address _loaAddress;
    mapping(address => uint8) _admins;

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

    Admin _admin;

    event NFTMinted(
        uint256 indexed itemIds,
        uint256 indexed capsuleIds,
        address indexed buyer,
        uint256 price
    );

    constructor(address loaAddress, address adminContractAddress)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _loaAddress = loaAddress;
        _admin = Admin(adminContractAddress);
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
        if (msg.sender != _admin.getNFTAttributeAddress())
            require(_nft_status[id] == 2, "Id is not minted");
        string memory attributes = "";
        if(_nft_status[id] == 2) {
            attributes = INFTAttribute(_admin.getNFTAttributeAddress()).getNFTAttributes(id);
        }
        return (_nft_hero[id], _nft_level[id], _nft_owner[id], _nft_status[id], attributes);
        // return (_nft_hero[id], _nft_level[id], _nft_owner[id], _nft_status[id]);
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
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidMarketPlaceContract(from) 
            || _admin.isValidMarketPlaceContract(to) 
            || _admin.isValidMarketPlaceContract(msg.sender),
                "Not authorized to transfer"
        );
        
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

        return super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(_admin.isValidMarketPlaceContract(from) 
            || _admin.isValidMarketPlaceContract(to) 
            || _admin.isValidMarketPlaceContract(msg.sender),
                "Not authorized to transfer"
        );
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

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function fusion(
        address owner,
        uint256[] memory ids,
        uint8 fusionLevel,
        uint256 price
    ) public {
        require(msg.sender == _admin.getFusionAddress(), "Not authorized");

        for (uint8 i = 0; i < ids.length; i++) {
            _burn(owner, ids[i], 1);
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

        _mint(owner, id, 1, "");
        _user_holdings[owner].push(id);
        _nft_level_to_ids[_nft_level[id]].pop();

        emit NFTMinted(id, 0, owner, price);
    }

    function mint(uint256 capsuleId) public {
        require(
            IERC1155Contract(_admin.getCapsuleAddress()).balanceOf(
                msg.sender,
                capsuleId
            ) > 0,
            "Capsule is not owned by user"
        );
        (, uint8 capsuleLevel, ,,,) = IERC1155Contract(
            _admin.getCapsuleAddress()
        ).getCapsuleDetail(capsuleId);

        uint256 id = _nft_level_to_ids[capsuleLevel][
            _nft_level_to_ids[capsuleLevel].length - 1
        ];
        require(_nft_status[id] == 1, "id is not available");

        uint256 fee = _minting_fee[capsuleLevel];
        require(
            IERC20Contract(_loaAddress).balanceOf(msg.sender) >= fee,
            "Not enough minting fee available"
        );

        _nft_owner[id] = msg.sender;
        _nft_status[id] = 2;

        _mint(msg.sender, id, 1, "");
        _user_holdings[msg.sender].push(id);
        IERC1155Contract(_admin.getCapsuleAddress()).burn(
            msg.sender,
            capsuleId
        );
        _nft_level_to_ids[_nft_level[id]].pop();

        IERC20Contract(_loaAddress).transferFrom(
            msg.sender,
            _admin.getTreasury(),
            fee
        );
        emit NFTMinted(id, capsuleId, msg.sender, 0);
    }

    function withdraw(address tokenAddress) public validAdmin {
        if (tokenAddress == address(0)) {
            payable(_admin.getTreasury()).transfer(address(this).balance);
            return;
        }

        IERC20Contract token = IERC20Contract(tokenAddress);
        token.transfer(_admin.getTreasury(), token.balanceOf(address(this)));
    }
}
