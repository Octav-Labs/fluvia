// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IFeeController {
	/// @return collector  address to receive fees
	/// @return fee        fee to take (in USDC base units), computed as (gross * bps / 10_000)
	/// @return minNet     minimum net amount required (USDC units)
	/// @return maxFee     max fee for circle fast payment
	function quoteFee(
		address fluvia, // fluvia owner()
		uint256 amount // gross Amount
	) external view returns (address collector, uint256 fee, uint256 minNet, uint256 maxFee);
}
