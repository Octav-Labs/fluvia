// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IFeeController}  from "./interfaces/IFeeController.sol";
import {ITokenMessenger}  from "./interfaces/ITokenMessenger.sol";

contract Receiver is Ownable, Pausable, ReentrancyGuard {
	using SafeERC20 for IERC20;

	IERC20           public immutable USDC;
	ITokenMessenger  public immutable tokenMessenger;     // CCTP messenger on SOURCE chain
	uint32           public immutable destDomain;         // Circle domain for DEST chain
	IFeeController   public immutable feeController;    //  FeeController

	bytes32 public destRecipient;

	error NothingToSettle();
	error InvalidFee();
	error NetTooSmall();

	constructor(
		address owner,
		address usdc,
		address cctpMessenger,
		uint32  _destDomain,
		bytes32 _destRecipient,
		address _feeController
	) Ownable(owner) {
		require(owner != address(0), "owner 0x0");
		require(usdc != address(0), "usdc 0x0");
		require(cctpMessenger != address(0), "messenger 0x0");
		require(_destRecipient != bytes32(0), "destRecipient 0x0");
		require(_feeController != address(0), "provider 0x0");

		USDC            = IERC20(usdc);
		tokenMessenger  = ITokenMessenger(cctpMessenger);
		destDomain      = _destDomain;
		destRecipient   = _destRecipient;
		feeController   = IFeeController(_feeController);

		_transferOwnership(owner);

		USDC.approve(address(tokenMessenger), type(uint256).max);
	}

	function setDestRecipientAddress(address newRecipient) external onlyOwner {
		require(newRecipient != address(0), "recipient is 0x0");
		destRecipient = _evmToBytes32(newRecipient);
	}

	function settle() external nonReentrant whenNotPaused {
		uint256 bal = USDC.balanceOf(address(this));
		if (bal == 0) revert NothingToSettle();

		(address collector, uint256 fee, uint256 minNet, uint256 maxFee) =
								IFeeController(feeController).quoteFee(address(this), bal);

		if (fee > bal) revert InvalidFee();

		uint256 netAmount = bal - fee;

		if (netAmount < minNet) revert NetTooSmall();

		if (fee > 0 && collector != address(0)) {
			USDC.safeTransfer(collector, fee);
		}

		/// Approve messenger and burn native USDC on source chain
		tokenMessenger.depositForBurn(netAmount, destDomain, destRecipient, address(USDC), bytes32(0), maxFee,1000);
	}

	/// Rescue tokens OTHER than USDC
	function rescueToken(address token, address to, uint256 amt) external onlyOwner {
		require(token != address(USDC), "no USDC");
		IERC20(token).safeTransfer(to, amt);
	}

	function _evmToBytes32(address a) internal pure returns (bytes32) {
		// left-pad the 20-byte address into 32 bytes (address in low 20 bytes)
		return bytes32(uint256(uint160(a)));
	}
}
