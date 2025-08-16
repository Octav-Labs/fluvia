// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IFeeController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FeeController is Ownable, IFeeController {
    uint16 public fastMaxFeeBps; // Circle Fast Fee BPS

    struct Config {
        address collector; // fee recipient
        uint16 feeBps; // 1 = 0.01%, 100 = 1%, max 500 (5%)
        uint256 minNet; // min net (post-fee) required to proceed
        bool set; // marker for fluvia override existence
    }

    Config public globalCfg;
    mapping(address fluvia => Config) public fluviaCfg;

    constructor(
        address admin,
        address collector,
        uint16 feeBps,
        uint256 minNet,
        uint16 _fastMaxFeeBps
    ) Ownable(admin) {
        require(collector != address(0), "collector is 0x0");
        require(feeBps <= 500, "bps>5%");
        globalCfg = Config({
            collector: collector,
            feeBps: feeBps,
            minNet: minNet,
            set: true
        });
        require(_fastMaxFeeBps <= 500, "maxfee bps>5%");
        fastMaxFeeBps = _fastMaxFeeBps;
    }

    function setGlobal(
        address collector,
        uint16 feeBps,
        uint256 minNet
    ) public onlyOwner {
        require(collector != address(0), "collector is 0x0");
        require(feeBps <= 500, "bps>5%");
        globalCfg = Config({
            collector: collector,
            feeBps: feeBps,
            minNet: minNet,
            set: true
        });
    }

    /// @dev used to set circles max bps
    function setMaxFeeBps(uint16 bps) public onlyOwner {
        require(bps <= 500, "bps>5%");
        fastMaxFeeBps = bps;
    }

    /// @notice Optional per-fluvia override (bps-only).
    function setFluviaOverride(
        address fluvia,
        address collector,
        uint16 feeBps,
        uint256 minNet
    ) external onlyOwner {
        require(fluvia != address(0) && collector != address(0), "zero");
        require(feeBps <= 500, "bps > 5%");
        fluviaCfg[fluvia] = Config({
            collector: collector,
            feeBps: feeBps,
            minNet: minNet,
            set: true
        });
    }

    function clearfluviaOverride(address fluvia) external onlyOwner {
        delete fluviaCfg[fluvia];
    }

    function quoteFee(
        address fluvia,
        uint256 amount
    )
        external
        view
        returns (address collector, uint256 fee, uint256 minNet, uint256 maxFee)
    {
        Config memory cfg = fluviaCfg[fluvia].set
            ? fluviaCfg[fluvia]
            : globalCfg;
        collector = cfg.collector;
        fee = (amount * cfg.feeBps) / 10_000;
        minNet = cfg.minNet;
        maxFee = (amount * fastMaxFeeBps) / 10_000;
    }
}
