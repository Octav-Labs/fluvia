// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IFeeController} from "./interfaces/IFeeController.sol";
import {ITokenMessenger} from "./interfaces/ITokenMessenger.sol";

contract Receiver is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    IERC20 public USDC;
    ITokenMessenger public tokenMessenger;
    uint32 public destDomain;
	uint32 public localDomain;
    IFeeController public feeController;
    bytes32 public destRecipient;

    error NothingToSettle();
    error InvalidFee();
    error NetTooSmall();

    function initialize(
        address owner_,
        address usdc,
        address cctpMessenger,
        uint32 _destDomain,
	    uint32  _localDomain,
        bytes32 _destRecipient,
        address _feeController
    ) external initializer {
        require(owner_ != address(0), "owner 0x0");
        require(usdc != address(0), "usdc 0x0");
        require(cctpMessenger != address(0), "messenger 0x0");
        require(_destRecipient != bytes32(0), "destRecipient 0x0");
        require(_feeController != address(0), "provider 0x0");

        __Ownable_init(owner_);
        __Pausable_init();
        __ReentrancyGuard_init();

        USDC = IERC20(usdc);
        tokenMessenger = ITokenMessenger(cctpMessenger);
        destDomain = _destDomain;
	    localDomain = _localDomain;
        destRecipient = _destRecipient;
        feeController = IFeeController(_feeController);

        USDC.approve(address(tokenMessenger), type(uint256).max);
    }

    function setDestRecipientAddress(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "recipient is 0x0");
        destRecipient = _evmToBytes32(newRecipient);
    }

    function settle() external nonReentrant whenNotPaused {
        uint256 bal = USDC.balanceOf(address(this));
        if (bal == 0) revert NothingToSettle();

        (
            address collector,
            uint256 fee,
            uint256 minNet,
            uint256 maxFee
        ) = feeController.quoteFee(owner(), bal); // keep or swap to feeSubject if you want fees pinned

        if (fee > bal) revert InvalidFee();
        uint256 netAmount = bal - fee;
        if (netAmount < minNet) revert NetTooSmall();

        if (fee > 0 && collector != address(0)) {
            USDC.safeTransfer(collector, fee);
        }

	    if (destDomain == localDomain) {
		    // normal transfer on localDomain
		    USDC.safeTransfer(_bytes32ToAddress(destRecipient), netAmount);
		    return;
	    }

        tokenMessenger.depositForBurn(
            netAmount,
            destDomain,
            destRecipient,
            address(USDC),
            bytes32(0),
            maxFee,
            1000
        );
    }

    function rescueToken(
        address token,
        address to,
        uint256 amt
    ) external onlyOwner {
        require(token != address(USDC), "no USDC");
        IERC20(token).safeTransfer(to, amt);
    }

    function _evmToBytes32(address a) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(a)));
    }

    function _bytes32ToAddress(bytes32 b) internal pure returns (address) {
        return address(uint160(uint256(b)));
    }
}
