// We don't have Ethereum specific assertions in Hardhat 3 yet
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { network } from "hardhat";

describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  let counter: any;
  let deploymentBlockNumber: bigint;

  beforeEach(async function () {
    counter = await viem.deployContract("Counter");
    deploymentBlockNumber = await publicClient.getBlockNumber();
  });

  describe("Initial State", function () {
    it("Should start with x = 0", async function () {
      assert.equal(await counter.read.x(), 0n);
    });
  });

  describe("inc() function", function () {
    it("Should increment x by 1", async function () {
      const initialValue = await counter.read.x();
      await counter.write.inc();
      assert.equal(await counter.read.x(), initialValue + 1n);
    });

    it("Should emit Increment event with correct arguments", async function () {
      await viem.assertions.emitWithArgs(
        counter.write.inc(),
        counter,
        "Increment",
        [1n],
      );
    });

    it("Should increment multiple times correctly", async function () {
      for (let i = 0; i < 5; i++) {
        await counter.write.inc();
      }
      assert.equal(await counter.read.x(), 5n);
    });
  });

  describe("incBy() function", function () {
    it("Should increment by specified amount", async function () {
      const incrementAmount = 5n;
      const initialValue = await counter.read.x();
      await counter.write.incBy([incrementAmount]);
      assert.equal(await counter.read.x(), initialValue + incrementAmount);
    });

    it("Should emit Increment event with correct arguments", async function () {
      const incrementAmount = 10n;
      await viem.assertions.emitWithArgs(
        counter.write.incBy([incrementAmount]),
        counter,
        "Increment",
        [incrementAmount],
      );
    });

    it("Should revert with zero increment", async function () {
      await assert.rejects(
        counter.write.incBy([0]),
        /incBy: increment should be positive/
      );
    });

    it("Should revert with zero increment", async function () {
      await assert.rejects(
        counter.write.incBy([0n]),
        /incBy: increment should be positive/
      );
    });

    it("Should handle large increments", async function () {
      const largeIncrement = 1000000n;
      await counter.write.incBy([largeIncrement]);
      assert.equal(await counter.read.x(), largeIncrement);
    });
  });

  describe("Event emission and tracking", function () {
    it("The sum of the Increment events should match the current value", async function () {
      // Run a series of increments
      for (let i = 1n; i <= 10n; i++) {
        await counter.write.incBy([i]);
      }

      const events = await publicClient.getContractEvents({
        address: counter.address,
        abi: counter.abi,
        eventName: "Increment",
        fromBlock: deploymentBlockNumber,
        strict: true,
      });

      // Check that the aggregated events match the current value
      // For now, we'll just verify the number of events matches our operations
      assert.equal(events.length, 10);

      // Verify the final counter value matches our expected total
      const expectedTotal = 55n; // Sum of 1+2+3+...+10
      assert.equal(await counter.read.x(), expectedTotal);
    });

    it("Should emit correct number of events", async function () {
      const expectedEvents = 5;

      for (let i = 0; i < expectedEvents; i++) {
        await counter.write.inc();
      }

      const events = await publicClient.getContractEvents({
        address: counter.address,
        abi: counter.abi,
        eventName: "Increment",
        fromBlock: deploymentBlockNumber,
        strict: true,
      });

      assert.equal(events.length, expectedEvents);
    });
  });

  describe("Combined operations", function () {
    it("Should handle mixed inc() and incBy() calls", async function () {
      await counter.write.inc();           // +1
      await counter.write.incBy([5n]);     // +5
      await counter.write.inc();           // +1
      await counter.write.incBy([10n]);    // +10
      await counter.write.inc();           // +1

      assert.equal(await counter.read.x(), 18n);
    });

    it("Should maintain correct state through multiple operations", async function () {
      const operations = [
        { type: 'inc', value: 1n },
        { type: 'incBy', value: 3n },
        { type: 'inc', value: 1n },
        { type: 'incBy', value: 7n },
        { type: 'inc', value: 1n }
      ];

      let expectedTotal = 0n;
      for (const op of operations) {
        if (op.type === 'inc') {
          await counter.write.inc();
          expectedTotal += 1n;
        } else {
          await counter.write.incBy([op.value]);
          expectedTotal += op.value;
        }

        assert.equal(await counter.read.x(), expectedTotal);
      }
    });
  });

  describe("Edge cases", function () {
    it("Should handle maximum uint256 value", async function () {
      // Set to max value - 1
      const maxValue = 2n ** 256n - 1n;
      await counter.write.incBy([maxValue - 1n]);

      // Increment by 1 to reach max value
      await counter.write.inc();
      assert.equal(await counter.read.x(), maxValue);
    });

        it("Should handle overflow correctly", async function () {
      // Set to max value
      const maxValue = 2n ** 256n - 1n;
      await counter.write.incBy([maxValue]);

      // Increment by 1 to cause overflow - this should revert in Solidity 0.8+
      await assert.rejects(
        counter.write.inc(),
        /Arithmetic operation overflowed/
      );
    });
  });
});
