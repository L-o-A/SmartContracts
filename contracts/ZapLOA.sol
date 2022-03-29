// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


interface IZap {
    function covers(address _token) external view returns (bool);
    function zapOut(address _from, uint amount) external;
    function zapIn(address _to) external payable;
    function zapInToken(address _from, uint amount, address _to) external;
}


interface IBEP20 {
    function totalSupply() external view returns (uint256);

    function decimals() external view returns (uint8);

    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function getOwner() external view returns (address);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address _owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}


interface IPancakeRouter01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    payable
    returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    returns (uint[] memory amounts);
}

interface IPancakeRouter02 is IPancakeRouter01 {

}


library Address {
    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}


library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, 'SafeMath: addition overflow');
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, 'SafeMath: subtraction overflow');
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, 'SafeMath: division by zero');
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }
}


library SafeBEP20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(
        IBEP20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IBEP20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            'SafeBEP20: approve from non-zero to non-zero allowance'
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IBEP20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(
            value,
            'SafeBEP20: decreased allowance below zero'
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function _callOptionalReturn(IBEP20 token, bytes memory data) private {
        bytes memory returndata = address(token).functionCall(data, 'SafeBEP20: low-level call failed');
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), 'SafeBEP20: BEP20 operation did not succeed');
        }
    }
}


contract ZapLOA {
    using SafeMath for uint;
    using SafeBEP20 for IBEP20;

    /* ========== CONSTANT VARIABLES ========== */

    // address private constant LOA = 0x94b69263FCA20119Ae817b6f783Fc0F13B02ad50;

    // address private constant BUNNY = 0x4C16f69302CcB511c5Fac682c7626B9eF0Dc126a;
    // address private constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    // address private constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    // address private constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    // address private constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    // address private constant QUICK = 0x831753DD7087CaC61aB5644b308642cc1c33Dc13;
    // address private constant BTC = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;
    // address private constant ETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
    // address private constant AAVE = 0xD6DF932A45C0f255f85145f286eA0b292B21C90B;


    //TESTNET
    address private LOA; // 0x6eC9aE46b4a4ce6Be27448C5ca65c063A2b217Ea;
    address private BUSD; // 0x3037c0161d3E2Fa8a5FE0bd7C254b1fDD151395a;
    address private WMATIC; // 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;

    address private ROUTER_ADDRESS;
    IPancakeRouter02 private ROUTER; // LIVE 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff , Test 0xD99D1c33F9fC3444f8101754aBC46c52416550D1

    /* ========== STATE VARIABLES ========== */

    mapping(address => bool) private notFlip;
    mapping(address => address) private routePairAddresses;
    address[] public tokens;

    address private _admin;


    constructor(
            address busdAddress, 
            address loaAdddress, 
            address maticAdddress, 
            address pancakeRouterAddress
        ) {
        _admin = msg.sender;

        setNotFlip(BUSD);
        setRoutePairAddress(LOA, BUSD);

        ROUTER_ADDRESS = pancakeRouterAddress;
        ROUTER = IPancakeRouter02(0xD99D1c33F9fC3444f8101754aBC46c52416550D1);

        LOA = loaAdddress;
        BUSD = busdAddress;
        WMATIC = maticAdddress;
    }

    // Modifier
    modifier onlyOwner() {
        require(_admin == msg.sender, "Only admin can access this");
        _;
    }

    function updateAdmin (address newOwner) public onlyOwner(){
         _admin = newOwner;
    }

    receive() external payable {}

    /* ========== View Functions ========== */

    function isFlip(address _address) public view returns (bool) {
        return !notFlip[_address];
    }

    function covers(address _token) public view returns (bool) {
        return notFlip[_token];
    }

    function routePair(address _address) external view returns (address) {
        return routePairAddresses[_address];
    }


    /* ========== External Functions ========== */

    function zap ( address token, uint256 amount) external {

        require(covers(token), "Provided token not covered");
        IBEP20 busdToken = IBEP20(token);

        uint256 halfBUSDAmount = 0;
        uint256 loaAmount = 0;

        if(token != BUSD) {

            IBEP20 anyToken = IBEP20(token);
            require(anyToken.balanceOf(msg.sender) >= amount, "Amount not available" );

            anyToken.safeTransferFrom(msg.sender, address(this), amount);
            _approveTokenIfNeeded(token, amount);

            uint256 amountBUSD = _swap(token, amount, BUSD, address(this));

            halfBUSDAmount = SafeMath.div(amountBUSD, 2);

            _approveTokenIfNeeded(BUSD, amountBUSD);

             loaAmount = _swap(BUSD, halfBUSDAmount, LOA, address(this));
            _approveTokenIfNeeded(LOA, loaAmount);
            
        }
        else {

            require(busdToken.balanceOf(msg.sender) >= amount, "Amount not available" );

            halfBUSDAmount = SafeMath.div(amount, 2);

            busdToken.safeTransferFrom(msg.sender, address(this), amount);
            _approveTokenIfNeeded(token, amount);

            loaAmount = _swap(BUSD, halfBUSDAmount, LOA, address(this));
            _approveTokenIfNeeded(LOA, loaAmount);
        }

         ROUTER.addLiquidity(
                BUSD,
                LOA,
                halfBUSDAmount,
                loaAmount,
                0,
                0,
                msg.sender,
                block.timestamp
            );
    }


    /* ========== Private Functions ========== */

    function _approveTokenIfNeeded(address token, uint amount) private {
        if (IBEP20(token).allowance(address(this), address(ROUTER)) < amount) {
            IBEP20(token).safeIncreaseAllowance(address(ROUTER), amount - IBEP20(token).allowance(address(this), address(ROUTER)));
        }
    }

    function _swap(
        address _from,
        uint amount,
        address _to,
        address receiver
    ) private returns (uint) {
        address intermediate = routePairAddresses[_from];
        if (intermediate == address(0)) {
            intermediate = routePairAddresses[_to];
        }

        address[] memory path;
        if (intermediate != address(0) && (_from == WMATIC || _to == WMATIC)) {
            // [WMATIC, QUICK, X] or [X, QUICK, WMATIC]
            path = new address[](3);
            path[0] = _from;
            path[1] = intermediate;
            path[2] = _to;
        } else if (intermediate != address(0) && (_from == intermediate || _to == intermediate)) {
            // [BTC, ETH] or [ETH, BTC]
            path = new address[](2);
            path[0] = _from;
            path[1] = _to;
        } else if (intermediate != address(0) && routePairAddresses[_from] == routePairAddresses[_to]) {
            // [BTC, ETH, DAI] or [DAI, ETH, BTC]
            path = new address[](3);
            path[0] = _from;
            path[1] = intermediate;
            path[2] = _to;
        } else if (
            routePairAddresses[_from] != address(0) &&
            routePairAddresses[_to] != address(0) &&
            routePairAddresses[_from] != routePairAddresses[_to]
        ) {
            // routePairAddresses[xToken] = xRoute
            // [X, BTC, ETH, USDC, Y]
            path = new address[](5);
            path[0] = _from;
            path[1] = routePairAddresses[_from];
            path[2] = WMATIC;
            path[3] = routePairAddresses[_to];
            path[4] = _to;
        } else if (intermediate != address(0) && routePairAddresses[_from] != address(0)) {
            // [BTC, ETH, WMATIC, QUICK]
            path = new address[](4);
            path[0] = _from;
            path[1] = intermediate;
            path[2] = WMATIC;
            path[3] = _to;
        } else if (intermediate != address(0) && routePairAddresses[_to] != address(0)) {
            // [QUICK, WMATIC, ETH, BTC]
            path = new address[](4);
            path[0] = _from;
            path[1] = WMATIC;
            path[2] = intermediate;
            path[3] = _to;
        } else if (_from == WMATIC || _to == WMATIC) {
            // [WMATIC, QUICK] or [QUICK, WMATIC]
            path = new address[](2);
            path[0] = _from;
            path[1] = _to;
        } else {
            // [QUICK, WMATIC, X] or [X, WMATIC, QUICK]
            path = new address[](3);
            path[0] = _from;
            path[1] = WMATIC;
            path[2] = _to;
        }

        uint[] memory amounts = ROUTER.swapExactTokensForTokens(amount, 0, path, receiver, block.timestamp);
        return amounts[amounts.length - 1];
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function setRoutePairAddress(address asset, address route) public onlyOwner {
        routePairAddresses[asset] = route;
    }

    function setNotFlip(address token) public onlyOwner {
        bool needPush = notFlip[token] == false;
        notFlip[token] = true;
        if (needPush) {
            tokens.push(token);
        }
    }

    function removeToken(uint i) external onlyOwner {
        address token = tokens[i];
        notFlip[token] = false;
        tokens[i] = tokens[tokens.length - 1];
        tokens.pop();
    }

    function sweep() external onlyOwner {
        for (uint i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            if (token == address(0)) continue;
            uint amount = IBEP20(token).balanceOf(address(this));
            if (amount > 0) {
                _swap(token, amount, BUSD, _admin);
            }
        }
    }

    function withdraw(address token) external onlyOwner {
        if (token == address(0)) {
            payable(_admin).transfer(address(this).balance);
            return;
        }

        IBEP20(token).transfer(_admin, IBEP20(token).balanceOf(address(this)));
    }
}