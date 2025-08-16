// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import ".pnpm/@openzeppelin+contracts@5.4.0/node_modules/@openzeppelin/contracts/access/Ownable2Step.sol";
import ".pnpm/@openzeppelin+contracts@5.4.0/node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import ".pnpm/@openzeppelin+contracts@5.4.0/node_modules/@openzeppelin/contracts/utils/Pausable.sol";
import ".pnpm/@openzeppelin+contracts@5.4.0/node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ITokenMessenger}  from "./interfaces/ITokenMessenger.sol";

contract Receiver is Ownable2Step, Pausable, ReentrancyGuard {
	using SafeERC20 for IERC20;

	IERC20           public immutable USDC;
	ITokenMessenger  public immutable tokenMessenger;     // CCTP messenger on SOURCE chain
	uint32           public immutable destDomain;         // Circle domain for DEST chain
//	IFeeController   public immutable feeController;    //  FeeController

	bytes32 public destRecipient;

	constructor(
		address owner,
		address usdc,
		address cctpMessenger,
		uint32  _destDomain,
		bytes32 _destRecipient,
		address addressProvider_
	) {
		require(owner != address(0), "owner 0x0");
		require(usdc != address(0), "usdc 0x0");
		require(cctpMessenger != address(0), "messenger 0x0");
		require(_destRecipient != bytes32(0), "destRecipient 0x0");
		require(addressProvider_ != address(0), "provider 0x0");
	}

	function setDestRecipientAddress(address newRecipient) external onlyOwner {
		require(newRecipient != address(0), "recipient=0");
		destRecipient = _evmToBytes32(newRecipient);
	}

	function _evmToBytes32(address a) internal pure returns (bytes32) {
		// left-pad the 20-byte address into 32 bytes (address in low 20 bytes)
		return bytes32(uint256(uint160(a)));
	}
}
