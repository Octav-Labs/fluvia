// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/ITokenMessenger.sol";

contract MockTokenMessenger is ITokenMessenger {
    struct CallData {
        uint256 amount;
        uint32 destinationDomain;
        bytes32 mintRecipient;
        address burnToken;
        bytes32 destinationCaller;
        uint256 maxFee;
        uint32 minFinalityThreshold;
    }

    CallData[] public calls;

    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken,
        bytes32 destinationCaller,
        uint256 maxFee,
        uint32 minFinalityThreshold
    ) external {
        calls.push(
            CallData({
                amount: amount,
                destinationDomain: destinationDomain,
                mintRecipient: mintRecipient,
                burnToken: burnToken,
                destinationCaller: destinationCaller,
                maxFee: maxFee,
                minFinalityThreshold: minFinalityThreshold
            })
        );
    }

    function getCalls() external view returns (CallData[] memory) {
        return calls;
    }

    function getCallCount() external view returns (uint256) {
        return calls.length;
    }
}
