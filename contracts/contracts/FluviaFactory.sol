// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Receiver.sol";

contract FluviaFactory is Ownable {
	address public immutable USDC;             // ERC20 USDC on this source chain
	address public immutable TOKEN_MESSENGER;  // CCTP v2 TokenMessenger on this source chain

	address public feeController;   // FeeController contract address
	address public implementation; // address to clone

	mapping(address => address[]) private _receivers; // fluviaOwner => [receiver0, receiver1, ...]

	constructor(
		address admin,
		address usdc,
		address cctpMessenger,
		address _feeController,
		address receiverImpl
	) Ownable(admin) {
		require(admin != address(0), "admin is 0x0");
		require(usdc != address(0), "usdc is 0x0");
		require(cctpMessenger != address(0), "messenger is 0x0");
		require(_feeController != address(0), "feeController is 0x0");
		require(receiverImpl != address(0), "impl is 0x0");

		USDC            = usdc;
		TOKEN_MESSENGER = cctpMessenger;
		feeController   = _feeController;
		implementation = receiverImpl;
	}

	// views

	function receiverCount(address fluviaOwner) external view returns (uint256) {
		return _receivers[fluviaOwner].length;
	}

	function receiverAt(address fluviaOwner, uint256 index) external view returns (address) {
		return _receivers[fluviaOwner][index];
	}

	function computeAddressForIndex(
		address fluviaOwner,
		uint256 index
	) public view returns (address) {
		bytes32 salt = keccak256(abi.encodePacked(fluviaOwner, index));
		return Clones.predictDeterministicAddress(implementation, salt, address(this));
	}

	function computeAddressForNext(
		address fluviaOwner
	) external view returns (address predicted, uint256 index) {
		index = _receivers[fluviaOwner].length;
		predicted = computeAddressForIndex(fluviaOwner, index);
	}

	function deploy(
		address fluviaOwner,
		uint32  destDomain,
		address destRecipient
	) external returns (address receiver, uint256 index) {
		require(fluviaOwner != address(0), "fluvia is 0x0");
		require(destRecipient != address(0), "recipient is 0x0");

		index = _receivers[fluviaOwner].length;
		bytes32 salt = keccak256(abi.encodePacked(fluviaOwner, index));
		receiver = Clones.cloneDeterministic(implementation, salt);

		bytes32 destRecipient32 = _evmToBytes32(destRecipient);
		Receiver(payable(receiver)).initialize(
			fluviaOwner,
			USDC,
			TOKEN_MESSENGER,
			destDomain,
			destRecipient32,
			feeController
		);

		_receivers[fluviaOwner].push(receiver);
	}

	function setFeeController(address controller) public onlyOwner {
		require(controller != address(0), "controller is 0x0");
		feeController = controller;
	}

	function setImplementation(address _impl) public onlyOwner {
		require(_impl != address(0), "impl is 0x0");
		implementation = _impl;
	}

	function _evmToBytes32(address a) internal pure returns (bytes32) {
		return bytes32(uint256(uint160(a)));
	}
}
