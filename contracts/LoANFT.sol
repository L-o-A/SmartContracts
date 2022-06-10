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
    function getCapsuleDetail(uint256 id) external view returns (uint8, uint8, uint8);
}

interface Admin {
    function isValidAdmin(address adminAddress) external pure returns (bool);
    function getTreasury() external view returns (address);
    function isValidRaffleAddress(address addr) external view returns (bool);
    function isValidCapsuleTransfer(address sender, address from, address to) external view returns (bool);
    function isValidMarketPlaceContract(address sender) external view returns (bool);
}

contract LoANFT is ERC1155, Ownable {

    address _loaAddress;
    IERC1155Contract _capsuleToken;
    address _nftMarketAddress;
    address _fusion_address;
    mapping(address => uint8) _admins;
    address _loaNFTAttributeAddress;

    // 0 : unpublished
    // 1 : ready to mint
    // 2 : minted
    // 3 : burned
    mapping(uint256 => uint8) public _nft_status;
    mapping(uint256 => uint8) _nft_level;
    mapping(uint256 => uint8) _nft_hero;
    mapping(uint256 => address) _nft_owner;

    mapping(uint8 => uint256[]) _nft_level_to_ids;
    mapping(uint8 => uint256) _minting_fee;
    mapping(address => uint256[]) _user_holdings;

    Admin _admin;


    event NFTMinted(
        uint256 indexed itemId,
        uint256 indexed capsuleId,
        address indexed buyer,
        uint256 price
    );

    constructor(address loaAddress, address adminContractAddress)
        ERC1155("https://nft.leagueofancients.com/api/nft/{id}.json")
    {
        _loaAddress = loaAddress;
        _admin = Admin(adminContractAddress);
    }

    function updateAccessAddressAndFees (
        address capsuleContract, 
        address nftMarketAddress,
        address fusion_address,
        address loaNFTAttributeAddress,
        uint8[] memory capsuleTypes,
        uint256[] memory fees) public validAdmin{
        _capsuleToken = IERC1155Contract(capsuleContract);
        _nftMarketAddress = nftMarketAddress;
        _fusion_address = fusion_address;
        _loaNFTAttributeAddress = loaNFTAttributeAddress;

        for(uint8 i = 0; i < capsuleTypes.length; i++) {
            _minting_fee[capsuleTypes[i]] = fees[i];
        }
    }

    // Modifier
    modifier validAdmin() {
        require(_admin.isValidAdmin(msg.sender), "You are not authorized.");
        _;
    }

    function getNFTDetail(uint256 id) public view returns (uint8, uint8, address, uint8) {
        if(msg.sender != _loaNFTAttributeAddress)
            require(_nft_status[id] == 2, "Id is not minted");

        return (
            _nft_hero[id],
            _nft_level[id],
            _nft_owner[id],
            _nft_status[id]
        );
    }

    function getUserNFTs() public view returns (uint256[] memory) {
        return _user_holdings[msg.sender];
    }


    function modifyNFTs(bool add,
        uint256[] memory ids,
        uint8[] memory levels,
        uint8[] memory heroes,
        uint256[] memory startTimes
    ) public validAdmin {

        if(add) {
            require(ids.length ==  levels.length 
            && levels.length == heroes.length 
            && heroes.length == startTimes.length, "Args length not matching");
            
            for (uint256 i = 0; i < ids.length; i++) {
                require(_nft_status[ids[i]] == 0, "Id is already published");
                if(_nft_status[ids[i]] == 0)
                    _nft_level_to_ids[levels[i]].push(ids[i]);

                _nft_status[ids[i]] = 1;
                _nft_level[ids[i]] = levels[i];
                _nft_hero[ids[i]] = heroes[i];
                
            }
        } else {
            for (uint256 i = 0; i < ids.length; i++) {
                require(_nft_status[ids[i]] == 0 || _nft_status[ids[i]] == 1, "Id is already consumed.");
                if(_nft_status[ids[i]] == 0) {
                    uint256[] storage cids = _nft_level_to_ids[_nft_level[ids[i]]];
                    for(uint256 j = 0; j < cids.length; j++) {
                        if(cids[j] == ids[i]) {
                            cids[j] = cids[cids.length -1];
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
        require(_admins[msg.sender] == 1 ||
            msg.sender == _nftMarketAddress ||
            to == address(0) ||
            msg.sender == address(this) || 
            to == _nftMarketAddress ||
            from == _nftMarketAddress, "Not authorized to transfer");

        return super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {

        require(_admins[msg.sender] == 1 ||
            msg.sender == _nftMarketAddress ||
            to == address(0) ||
            msg.sender == address(this) || 
            to == _nftMarketAddress ||
            from == _nftMarketAddress, "Not authorized to transfer");

        return super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function fusion(address owner, uint256[] memory ids, uint8 fusionLevel, uint256 price) public payable {
        require(msg.sender == _fusion_address, "Not authorized");
        
        for(uint8 i = 0; i < ids.length; i++) {
            _burn(owner, ids[i], 1);
            for(uint256 j = 0; j <= _user_holdings[owner].length; j++) {
                if(_user_holdings[owner][j] == ids[i]) {
                    _user_holdings[owner][j] = _user_holdings[owner][_user_holdings[owner].length - 1];
                    _user_holdings[owner].pop();
                }
            }
        }

        uint256 id = _nft_level_to_ids[fusionLevel][_nft_level_to_ids[fusionLevel].length -1];
        require(_nft_status[id] == 1, "id is not available");
        
        _nft_owner[id] = owner;
        _nft_status[id] = 2;

        _mint(owner, id, 1, "");
        _user_holdings[owner].push(id);
        _nft_level_to_ids[_nft_level[id]].pop();
        emit NFTMinted(id, 0, owner, price);
    }

    function mint(uint256 capsuleId) public payable {
        require(_capsuleToken.balanceOf(msg.sender, capsuleId) > 0, "Capsule is not owned by user");
        (, uint8 capsuleLevel, ) = _capsuleToken.getCapsuleDetail(capsuleId);

        uint256 id = _nft_level_to_ids[capsuleLevel][_nft_level_to_ids[capsuleLevel].length -1];
        require(_nft_status[id] == 1, "id is not available");
        
        uint256 fee = _minting_fee[capsuleLevel];
        require(IERC20Contract(_loaAddress).balanceOf(msg.sender) >= fee, "Not enough minting fee available" );

        _nft_owner[id] = msg.sender;
        _nft_status[id] = 2;

        _mint(msg.sender, id, 1, "");
        _user_holdings[msg.sender].push(id);
        _capsuleToken.burn(msg.sender, capsuleId);
        _nft_level_to_ids[_nft_level[id]].pop();

        IERC20Contract(_loaAddress).transferFrom(msg.sender, _admin.getTreasury(), fee);
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