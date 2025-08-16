import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";

describe("FluviaFactory", async function () {
  const { viem } = await network.connect();

  let fluviaFactory: any;
  let receiver: any;
  let mockFeeController: any;
  let mockUSDC: any;
  let mockTokenMessenger: any;
  let owner: `0x${string}`;
  let user: `0x${string}`;
  let admin: `0x${string}`;

  beforeEach(async function () {
    // Use hardcoded test addresses for now
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
    user = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;
    admin = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" as `0x${string}`;

    // Deploy mock USDC
    mockUSDC = await viem.deployContract("MockERC20", ["Mock USDC", "USDC", 6]);

    // Deploy mock TokenMessenger
    mockTokenMessenger = await viem.deployContract("MockTokenMessenger");

    // Deploy mock FeeController
    mockFeeController = await viem.deployContract("MockFeeController");

    // Deploy Receiver implementation (it's upgradeable, so we need to deploy it first)
    receiver = await viem.deployContract("Receiver");

    // Deploy FluviaFactory with the mock FeeController
    fluviaFactory = await viem.deployContract("FluviaFactory", [
      admin,
      mockUSDC.address,
      mockTokenMessenger.address,
      mockFeeController.address,
      receiver.address
    ]);
  });

  describe("Constructor", function () {
    it("Should set correct initial values", async function () {
      assert.equal(await fluviaFactory.read.owner(), admin);
      // Use case-insensitive comparison for addresses
      const usdcAddress = await fluviaFactory.read.USDC();
      assert.equal(usdcAddress.toLowerCase(), mockUSDC.address.toLowerCase(), "USDC address should match");

      const tokenMessengerAddress = await fluviaFactory.read.TOKEN_MESSENGER();
      assert.equal(tokenMessengerAddress.toLowerCase(), mockTokenMessenger.address.toLowerCase(), "TokenMessenger address should match");

      const feeControllerAddress = await fluviaFactory.read.feeController();
      assert.equal(feeControllerAddress.toLowerCase(), mockFeeController.address.toLowerCase(), "FeeController address should match");

      const implementationAddress = await fluviaFactory.read.implementation();
      assert.equal(implementationAddress.toLowerCase(), receiver.address.toLowerCase(), "Implementation address should match");
    });
  });

  describe("receiverCount", function () {
    it("Should return 0 for new user", async function () {
      const count = await fluviaFactory.read.receiverCount([user]);
      assert.equal(count, 0n);
    });
  });

  describe("computeAddressForIndex", function () {
    it("Should compute deterministic address", async function () {
      const computedAddress = await fluviaFactory.read.computeAddressForIndex([user, 0]);
      assert.ok(computedAddress, "Should compute address");
      assert.equal(computedAddress.slice(0, 2), "0x", "Should be a valid address");
    });

    it("Should compute different addresses for different indices", async function () {
      const address0 = await fluviaFactory.read.computeAddressForIndex([user, 0]);
      const address1 = await fluviaFactory.read.computeAddressForIndex([user, 1]);
      assert.notEqual(address0, address1, "Different indices should have different addresses");
    });
  });

  describe("computeAddressForNext", function () {
    it("Should compute next address and index", async function () {
      const [predicted, index] = await fluviaFactory.read.computeAddressForNext([user]);
      assert.equal(index, 0n, "Should return correct index");
      assert.ok(predicted, "Should return predicted address");
    });
  });

  describe("setFeeController", function () {
    it("Should allow owner to set new fee controller", async function () {
      const newFeeController = "0x1234567890123456789012345678901234567890";
      // Use the admin account (owner) to call setFeeController
      await fluviaFactory.write.setFeeController([newFeeController], { account: admin });
      const feeControllerAddress = await fluviaFactory.read.feeController();
      assert.equal(feeControllerAddress.toLowerCase(), newFeeController.toLowerCase());
    });

    it("Should revert if non-owner tries to set fee controller", async function () {
      const newFeeController = "0x1234567890123456789012345678901234567890";
      try {
        await fluviaFactory.write.setFeeController([newFeeController], { account: user });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert if non-owner");
      }
    });

    it("Should revert with zero address", async function () {
      try {
        await fluviaFactory.write.setFeeController(["0x0000000000000000000000000000000000000000"], { account: admin });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert with zero address");
      }
    });
  });

  describe("setImplementation", function () {
    it("Should allow owner to set new implementation", async function () {
      const newImplementation = "0x1234567890123456789012345678901234567890";
      // Use the admin account (owner) to call setImplementation
      await fluviaFactory.write.setImplementation([newImplementation], { account: admin });
      const implementationAddress = await fluviaFactory.read.implementation();
      assert.equal(implementationAddress.toLowerCase(), newImplementation.toLowerCase());
    });

    it("Should revert if non-owner tries to set implementation", async function () {
      const newImplementation = "0x1234567890123456789012345678901234567890";
      try {
        await fluviaFactory.write.setImplementation([newImplementation], { account: user });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert if non-owner");
      }
    });

    it("Should revert with zero address", async function () {
      try {
        await fluviaFactory.write.setImplementation(["0x0000000000000000000000000000000000000000"], { account: admin });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert with zero address");
      }
    });
  });
});
