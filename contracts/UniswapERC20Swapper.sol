// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";
import '@uniswap/universal-router/contracts/interfaces/external/IWETH9.sol';

import "./interfaces/ERC20Swapper.sol";

contract UniswapERC20Swapper is Initializable, OwnableUpgradeable, UUPSUpgradeable, ERC20Swapper {

    uint24 public defaultFee;
    address public swapRouterAddr;
    address public wethAddr;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Since proxied contracts don't use constructor, we use this initializer function
    /// @param _swapRouterAddr Uniswap SwapRouter address
    /// @param _wethAddr IWETH9 address
    function initialize(address _swapRouterAddr, address _wethAddr) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        //We use 0.3% of fee per swap, which is the most common behavior on Uniswap pools
        defaultFee = 3000;
        swapRouterAddr = _swapRouterAddr;
        wethAddr = _wethAddr;
    }

    /// @notice Default function override used on UUPS proxy, to let the owner update to a new implementation
    /// @param newImplementation New contract implementation's address
    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

    /// @dev {swapEtherToToken} with a parameterizable fee
    function _swapEtherToToken(address token, uint minAmount, uint24 fee) public payable returns (uint){
        require(minAmount >= 0, "minAmount can't be negative");
        require(fee > 0, "fee should be positive");

        //Deposit msg.value to this contract to be wrapped on IWETH9
        IWETH9(wethAddr).deposit{value: msg.value}();
        //Approve the transfer of msg.value IWETH to the SwapRouter, which will trigger the swap
        IWETH9(wethAddr).approve(swapRouterAddr, msg.value);

        //Define all the params for the swap
        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter.ExactInputSingleParams({
            tokenIn: wethAddr,
            tokenOut: token,
            fee: fee,
            recipient: msg.sender,
            amountIn: msg.value,
            amountOutMinimum: minAmount,
            sqrtPriceLimitX96: 0
        });

        //Execute the swap and return the amount of transferred tokens
        return IV3SwapRouter(swapRouterAddr).exactInputSingle(params);
    }

    // @dev See {ERC20Swapper-swapEtherToToken}
    function swapEtherToToken(address token, uint minAmount) external payable returns (uint){
        //Calls {_swapEtherToToken} with the default fee
        return _swapEtherToToken(token, minAmount, defaultFee);
    }
}
