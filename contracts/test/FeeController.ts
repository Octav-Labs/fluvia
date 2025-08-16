import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";

describe("FeeController", async function () {
  const { viem } = await network.connect();

  let feeController: any;
  let owner: `0x${string}`;
  let collector: `0x${string}`;
  let fluvia: `0x${string}`;
  let user: `0x${string}`;

  beforeEach(async function () {
    // Use hardcoded test addresses for now
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
    collector = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;
    fluvia = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" as `0x${string}`;
    user = "0x90F79bf6EB2c4f870365E785982E1f101E93b906" as `0x${string}`;

    // Deploy FeeController with default values
    feeController = await viem.deployContract("FeeController", [
      owner,
      collector,
      100, // 1% fee (100 basis points)
      1000n, // 1000 minimum net
      200 // 2% max fee (200 basis points)
    ]);
  });

  describe("Constructor", function () {
    it("Should set correct initial values", async function () {
      assert.equal(await feeController.read.owner(), owner);
      assert.equal(await feeController.read.fastMaxFeeBps(), 200);

      // Read the struct directly
      const globalConfig = await feeController.read.globalCfg();
      assert.equal(globalConfig[0], collector); // collector
      assert.equal(globalConfig[1], 100); // feeBps
      assert.equal(globalConfig[2], 1000n); // minNet
      assert.equal(globalConfig[3], true); // set
    });

    it("Should transfer ownership to admin", async function () {
      assert.equal(await feeController.read.owner(), owner);
    });
  });

  describe("setGlobal", function () {
    it("Should allow owner to set global configuration", async function () {
      const newCollector = user;
      const newFeeBps = 200; // 2%
      const newMinNet = 2000n;

      await feeController.write.setGlobal([newCollector, newFeeBps, newMinNet]);

      // Read the struct directly
      const globalConfig = await feeController.read.globalCfg();
      assert.equal(globalConfig[0], newCollector); // collector
      assert.equal(globalConfig[1], newFeeBps); // feeBps
      assert.equal(globalConfig[2], newMinNet); // minNet
      assert.equal(globalConfig[3], true); // set
    });

    it("Should revert if non-owner tries to set global config", async function () {
      await assert.rejects(
        feeController.write.setGlobal([user, 200, 2000n], { account: user }),
        /OwnableUnauthorizedAccount/
      );
    });

    it("Should revert with zero collector address", async function () {
      await assert.rejects(
        feeController.write.setGlobal(["0x0000000000000000000000000000000000000000", 200, 2000n]),
        /collector is 0x0/
      );
    });

    it("Should revert with fee BPS greater than 500 (5%)", async function () {
      await assert.rejects(
        feeController.write.setGlobal([user, 501, 2000n]),
        /bps>5%/
      );
    });

    it("Should allow fee BPS equal to 500 (5%)", async function () {
      await feeController.write.setGlobal([user, 500, 2000n]);

      const globalConfig = await feeController.read.globalCfg();
      assert.equal(globalConfig[1], 500); // feeBps
    });
  });

  describe("setMaxFeeBps", function () {
    it("Should allow owner to set max fee BPS", async function () {
      const newMaxFeeBps = 300; // 3%
      await feeController.write.setMaxFeeBps([newMaxFeeBps]);

      assert.equal(await feeController.read.fastMaxFeeBps(), newMaxFeeBps);
    });

    it("Should revert if non-owner tries to set max fee BPS", async function () {
      await assert.rejects(
        feeController.write.setMaxFeeBps([300], { account: user }),
        /OwnableUnauthorizedAccount/
      );
    });

    it("Should revert with BPS greater than 500 (5%)", async function () {
      await assert.rejects(
        feeController.write.setMaxFeeBps([501]),
        /bps>5%/
      );
    });

    it("Should allow BPS equal to 500 (5%)", async function () {
      await feeController.write.setMaxFeeBps([500]);
      assert.equal(await feeController.read.fastMaxFeeBps(), 500);
    });
  });

  describe("setFluviaOverride", function () {
    it("Should allow owner to set fluvia override", async function () {
      const overrideCollector = user;
      const overrideFeeBps = 150; // 1.5%
      const overrideMinNet = 1500n;

      await feeController.write.setFluviaOverride([
        fluvia,
        overrideCollector,
        overrideFeeBps,
        overrideMinNet
      ]);

      // Read the struct directly
      const fluviaConfig = await feeController.read.fluviaCfg([fluvia]);
      assert.equal(fluviaConfig[0], overrideCollector); // collector
      assert.equal(fluviaConfig[1], overrideFeeBps); // feeBps
      assert.equal(fluviaConfig[2], overrideMinNet); // minNet
      assert.equal(fluviaConfig[3], true); // set
    });

    it("Should revert if non-owner tries to set fluvia override", async function () {
      await assert.rejects(
        feeController.write.setFluviaOverride([
          fluvia,
          user,
          150,
          1500n
        ], { account: user }),
        /OwnableUnauthorizedAccount/
      );
    });

    it("Should revert with zero addresses", async function () {
      await assert.rejects(
        feeController.write.setFluviaOverride([
          "0x0000000000000000000000000000000000000000",
          user,
          150,
          1500n
        ]),
        /zero/
      );

      await assert.rejects(
        feeController.write.setFluviaOverride([
          fluvia,
          "0x0000000000000000000000000000000000000000",
          150,
          1500n
        ]),
        /zero/
      );
    });

    it("Should revert with fee BPS greater than 500 (5%)", async function () {
      await assert.rejects(
        feeController.write.setFluviaOverride([
          fluvia,
          user,
          501,
          1500n
        ]),
        /bps > 5%/
      );
    });
  });

  describe("clearfluviaOverride", function () {
    it("Should allow owner to clear fluvia override", async function () {
      // First set an override
      await feeController.write.setFluviaOverride([
        fluvia,
        user,
        150,
        1500n
      ]);

      // Verify it's set
      let fluviaConfig = await feeController.read.fluviaCfg([fluvia]);
      assert.equal(fluviaConfig[3], true); // set

      // Clear the override
      await feeController.write.clearfluviaOverride([fluvia]);

      // Verify it's cleared
      fluviaConfig = await feeController.read.fluviaCfg([fluvia]);
      assert.equal(fluviaConfig[3], false); // set
    });

    it("Should revert if non-owner tries to clear fluvia override", async function () {
      await assert.rejects(
        feeController.write.clearfluviaOverride([fluvia], { account: user }),
        /OwnableUnauthorizedAccount/
      );
    });
  });

  describe("quoteFee", function () {
    it("Should return global config when no fluvia override exists", async function () {
      const amount = 10000n; // 10,000 USDC

      const [collector, fee, minNet, maxFee] = await feeController.read.quoteFee([
        fluvia,
        amount
      ]);

      // Global config: 1% fee, 1000 min net, 2% max fee
      assert.equal(collector, collector);
      assert.equal(fee, 100n); // 1% of 10000 = 100
      assert.equal(minNet, 1000n);
      assert.equal(maxFee, 2n); // 2% of 100 = 2
    });

    it("Should return fluvia override when it exists", async function () {
      // Set fluvia override
      await feeController.write.setFluviaOverride([
        fluvia,
        user,
        200, // 2% fee
        2000n // 2000 min net
      ]);

      const amount = 10000n; // 10,000 USDC

      const [overrideCollector, fee, minNet, maxFee] = await feeController.read.quoteFee([
        fluvia,
        amount
      ]);

      // Override config: 2% fee, 2000 min net, 2% max fee
      assert.equal(overrideCollector, user);
      assert.equal(fee, 200n); // 2% of 10000 = 200
      assert.equal(minNet, 2000n);
      assert.equal(maxFee, 4n); // 2% of 200 = 4
    });

    it("Should calculate fees correctly with different amounts", async function () {
      const testCases = [
        { amount: 1000n, expectedFee: 10n },   // 1% of 1000 = 10
        { amount: 5000n, expectedFee: 50n },   // 1% of 5000 = 50
        { amount: 10000n, expectedFee: 100n }, // 1% of 10000 = 100
        { amount: 50000n, expectedFee: 500n }  // 1% of 50000 = 500
      ];

      for (const testCase of testCases) {
        const [, fee] = await feeController.read.quoteFee([
          fluvia,
          testCase.amount
        ]);
        assert.equal(fee, testCase.expectedFee);
      }
    });

    it("Should calculate max fees correctly", async function () {
      // Set max fee BPS to 300 (3%)
      await feeController.write.setMaxFeeBps([300]);

      const amount = 10000n;
      const [, , , maxFee] = await feeController.read.quoteFee([
        fluvia,
        amount
      ]);

      // Fee: 1% of 10000 = 100, Max fee: 3% of 100 = 3
      assert.equal(maxFee, 3n);
    });

    it("Should handle zero amount", async function () {
      const amount = 0n;

      const [collector, fee, minNet, maxFee] = await feeController.read.quoteFee([
        fluvia,
        amount
      ]);

      assert.equal(collector, collector);
      assert.equal(fee, 0n);
      assert.equal(minNet, 1000n);
      assert.equal(maxFee, 0n);
    });
  });

  describe("Ownable functionality", function () {
    it("Should allow ownership transfer", async function () {
      await feeController.write.transferOwnership([user]);
      assert.equal(await feeController.read.owner(), user);
    });

    it("Should revert if non-owner calls restricted functions", async function () {
      await assert.rejects(
        feeController.write.setGlobal([user, 200, 2000n], { account: user }),
        /OwnableUnauthorizedAccount/
      );

      await assert.rejects(
        feeController.write.setMaxFeeBps([300], { account: user }),
        /OwnableUnauthorizedAccount/
      );

      await assert.rejects(
        feeController.write.setFluviaOverride([
          fluvia,
          user,
          150,
          1500n
        ], { account: user }),
        /OwnableUnauthorizedAccount/
      );

      await assert.rejects(
        feeController.write.clearfluviaOverride([fluvia], { account: user }),
        /OwnableUnauthorizedAccount/
      );
    });
  });
});
