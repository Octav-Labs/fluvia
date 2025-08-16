// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/IFeeController.sol";

contract MockFeeController is IFeeController {
    uint16 public fastMaxFeeBps = 200; // 2% max fee

    function quoteFee(
        address fluvia,
        uint256 amount
    )
        external
        pure
        returns (address collector, uint256 fee, uint256 minNet, uint256 maxFee)
    {
        // Return mock values for testing
        collector = address(0x1234567890123456789012345678901234567890);
        fee = (amount * 100) / 10000; // 1% fee
        minNet = 1000; // 1000 minimum net
        maxFee = (fee * 200) / 10000; // 2% max fee
    }
}
