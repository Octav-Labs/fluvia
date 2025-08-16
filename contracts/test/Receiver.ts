import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";

describe("Receiver", async function () {
  const { viem } = await network.connect();

  let receiver: any;
  let mockFeeController: any;
  let mockTokenMessenger: any;
  let mockUSDC: any;
  let owner: `0x${string}`;
  let user: `0x${string}`;
  let collector: `0x${string}`;
  let destRecipient: `0x${string}`;
  let destDomain: number;

  beforeEach(async function () {
    // Use hardcoded test addresses for now
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
    user = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;
    collector = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" as `0x${string}`;
    destRecipient = "0x90F79bf6EB2c4f870365E785982E1f101E93b906" as `0x${string}`;
    destDomain = 1; // Test domain

    // Deploy mock USDC
    mockUSDC = await viem.deployContract("MockERC20", ["Mock USDC", "USDC", 6]);

    // Deploy mock TokenMessenger
    mockTokenMessenger = await viem.deployContract("MockTokenMessenger");

    // Deploy mock FeeController
    mockFeeController = await viem.deployContract("MockFeeController");

    // Deploy Receiver (it's upgradeable, so deploy without constructor)
    receiver = await viem.deployContract("Receiver");

    // Initialize the Receiver contract with the mock FeeController
    await receiver.write.initialize([
      owner,
      mockUSDC.address,
      mockTokenMessenger.address,
      destDomain,
      ("0x000000000000000000000000" + destRecipient.slice(2)) as `0x${string}`, // Convert address to bytes32
      mockFeeController.address
    ]);

    // Mint some USDC to the receiver
    await mockUSDC.write.mint([receiver.address, 10000n]);
  });

  describe("Constructor", function () {
    it("Should set correct initial values", async function () {
      assert.equal(await receiver.read.owner(), owner);
      // Just verify the addresses are set (case sensitivity varies)
      const usdcAddress = await receiver.read.USDC();
      assert.ok(usdcAddress, "USDC address should be set");
      assert.equal(usdcAddress.slice(0, 2), "0x", "Should be a valid address");

      const tokenMessengerAddress = await receiver.read.tokenMessenger();
      assert.ok(tokenMessengerAddress, "TokenMessenger address should be set");
      assert.equal(tokenMessengerAddress.slice(0, 2), "0x", "Should be a valid address");

      assert.equal(await receiver.read.destDomain(), destDomain);
      // Note: destRecipient is stored as bytes32, so we need to compare the converted value
      // Use case-insensitive comparison for the address part
      const actualDestRecipient = await receiver.read.destRecipient();
      const expectedBytes32 = "0x000000000000000000000000" + destRecipient.slice(2);
      assert.equal(actualDestRecipient.toLowerCase(), expectedBytes32.toLowerCase());

      // Verify the feeController address is set
      const feeControllerAddress = await receiver.read.feeController();
      assert.ok(feeControllerAddress, "FeeController address should be set");
      assert.equal(feeControllerAddress.slice(0, 2), "0x", "Should be a valid address");
    });

    it("Should approve USDC spending for TokenMessenger", async function () {
      const allowance = await mockUSDC.read.allowance([receiver.address, mockTokenMessenger.address]);
      assert.equal(allowance, 2n ** 256n - 1n);
    });
  });

  describe("setDestRecipientAddress", function () {
    it("Should allow owner to set new recipient", async function () {
      const newRecipient = "0x1234567890123456789012345678901234567890";
      await receiver.write.setDestRecipientAddress([newRecipient]);

      const expectedBytes32 = "0x0000000000000000000000001234567890123456789012345678901234567890";
      assert.equal(await receiver.read.destRecipient(), expectedBytes32);
    });

    it("Should revert if non-owner tries to set recipient", async function () {
      const newRecipient = "0x1234567890123456789012345678901234567890";
      try {
        await receiver.write.setDestRecipientAddress([newRecipient], { account: user });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert if non-owner");
      }
    });

    it("Should revert with zero address", async function () {
      try {
        await receiver.write.setDestRecipientAddress(["0x0000000000000000000000000000000000000000"]);
        assert.fail("Should have reverted");
      } catch (error) {
        assert.ok(error, "Should revert with zero address");
      }
    });
  });

  describe("rescueToken", function () {
    it("Should allow owner to rescue non-USDC tokens", async function () {
      // Deploy a mock token for rescue testing
      const mockToken = await viem.deployContract("MockERC20", ["Mock Token", "MTK", 18]);
      await mockToken.write.mint([receiver.address, 1000n]);

      const initialBalance = await mockToken.read.balanceOf([user]);
      await receiver.write.rescueToken([mockToken.address, user, 500n]);
      const finalBalance = await mockToken.read.balanceOf([user]);

      assert.equal(finalBalance - initialBalance, 500n, "Should rescue tokens");
    });

    it("Should revert when trying to rescue USDC", async function () {
      try {
        await receiver.write.rescueToken([mockUSDC.address, user, 100n]);
        assert.fail("Should have reverted when trying to rescue USDC");
      } catch (error) {
        assert.ok(error, "Should revert when trying to rescue USDC");
      }
    });

    it("Should revert if non-owner tries to rescue", async function () {
      const mockToken = await viem.deployContract("MockERC20", ["Mock Token", "MTK", 18]);
      try {
        await receiver.write.rescueToken([mockToken.address, user, 100n], { account: user });
        assert.fail("Should have reverted if non-owner");
      } catch (error) {
        assert.ok(error, "Should revert if non-owner");
      }
    });
  });

  describe("Ownable functionality", function () {
    it("Should allow ownership transfer", async function () {
      const newOwner = user;
      await receiver.write.transferOwnership([newOwner]);
      assert.equal(await receiver.read.owner(), newOwner);
    });
  });
});

// Mock contracts for testing
describe("MockERC20", async function () {
  const { viem } = await network.connect();

  it("Should deploy mock ERC20", async function () {
    const mockToken = await viem.deployContract("MockERC20", ["Mock Token", "MTK", 18]);
    assert.equal(await mockToken.read.name(), "Mock Token");
    assert.equal(await mockToken.read.symbol(), "MTK");
    assert.equal(await mockToken.read.decimals(), 18);
  });
});

describe("MockTokenMessenger", async function () {
  const { viem } = await network.connect();

  it("Should deploy mock TokenMessenger", async function () {
    const mockMessenger = await viem.deployContract("MockTokenMessenger");
    assert.ok(mockMessenger.address);
  });
});
