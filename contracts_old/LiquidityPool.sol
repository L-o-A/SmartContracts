// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

import "hardhat/console.sol";


contract LiquidityPool is ReentrancyGuard, ERC1155Holder {

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    IERC20 public _loaToken; // External BUSD contract
    IERC20 public _stableToken;
    IERC20 public _lpToken;
    
    address private _admin;

    uint256 public _multiplierConst;
    uint256 public _lpTokenSupply;

    //Fee in 0.001%
    mapping(uint32 => uint256) private _withdrawalFee;

    event LPAdded(
        address depositor,
        address token,
        uint256 tokenAmount
    );

    event LPWithdrawn(
        address depositor,
        address token,
        uint256 tokenAmount,
        uint256 loaAmount
    );

    constructor(address loaToken, address stableToken, address lpToken) payable {
        _admin = msg.sender;
        _loaToken = IERC20(loaToken);
        _stableToken = IERC20(stableToken);
        _lpToken = IERC20(lpToken);
    }

    function initialize(uint256 loaAmount, uint256 stableAmount) {
        require(multiplierConst  == 0, "LP is already initialized");
        require(_loaToken.balanceOf(address(this))>= loaAmount, "LOA balance not available");
        require(_loaToken.allowance(msg.sender, address(this))>= loaAmount, "LOA balance not available");
        require(_stableToken.balanceOf(address(this))>= stableAmount, "Stable token balance not available");
        require(_stableToken.allowance(msg.sender, address(this))>= stableAmount, "Stable token balance not available");

        _loaToken.transferFrom(msg.sender, address(this), loaAmount);
        _stableToken.transferFrom(msg.sender, address(this), stableAmount);

        _multiplierConst = SafeMath.mul(loaAmount, stableAmount);
        _lpTokenSupply = SafeMath.sum(loaAmount, stableAmount);
        _lpToken.mint(msg.sender, _lpTokenSupply);

        emit LPAdded(msg.sender, token, tokenAmount);
    }

    function buyStable(uint256 loaAmount) {
        require(_loaToken.balanceOf(address(this))>= loaAmount, "LOA balance not available");
        require(_loaToken.allowance(msg.sender, address(this))>= loaAmount, "LOA balance not available");
        require(_loaToken.balanceOf(address(this)) >= loaAmount, "Engough LOA liquidity not available");

        uint256 memory newLoABalance = SafeMath.sum(_loaToken.balanceOf(address(this)), loaAmount);
        uint256 memory newStableBalance = SafeMath.div(_multiplierConst, newLoABalance);

        _loaToken.transferFrom(msg.sender, address(this), loaAmount);
        uint256 stableAmount = SafeMath.sub(_stableToken.balanceOf(address(this)), newStableBalance);
        require(stableAmount >= 0, "Too small stable token amount");
        _stableToken.transfer(msg.sender, stableAmount);
    }

    function buyLOA(uint256 stableAmount) {
        require(_stableToken.balanceOf(address(this))>= stableAmount, "Token balance not available");
        require(_stableToken.allowance(msg.sender, address(this))>= stableAmount, "Token balance not available");
        require(_stableToken.balanceOf(address(this)) >= stableAmount, "Engough Token liquidity not available");

        uint256 memory newStableBalance = SafeMath.sum(_stableToken.balanceOf(address(this)), stableAmount);
        uint256 memory newLoABalance = SafeMath.div(_multiplierConst, newStableBalance);

        _stableToken.transferFrom(msg.sender, address(this), stableAmount);
        uint256 loaAmount = SafeMath.sub(_loaToken.balanceOf(address(this)), newLoABalance);
        require(loaAmount >= 0, "Too small token amount");
        _loaToken.transfer(msg.sender, loaAmount);
    }

    function addLiquidity(uint256 stableAmount) {
        require(_stableToken.balanceOf(address(this))>= stableAmount, "Stable token balance not available");
        require(_stableToken.allowance(msg.sender, address(this))>= stableAmount, "Stable token balance not available");

        
    }

    function updateFees (
        uint32[] memory duration, 
        uint256[] memory fees) public {
        require(msg.sender == _admin, "You are not authorized");

        for(uint8 i = 0; i < duration.length; i++) {
            _withdrawalFee[duration[i]] = fees[i];
        }
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
