import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import {buildCreateXSalt} from "./scripts/saltCreator.js";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
    ignition: {
        strategyConfig: {
            create2: {
                salt: buildCreateXSalt('0xf25Ccfc9d2CE6425a7CE8582CCE57691c7ae2E21', 'v4', true), // increments for new versions
            },
        },
    },
    verify: {
        etherscan: {
            apiKey: configVariable('ETHERSCAN_KEY'),
        },
    },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    "base-sepolia": {
      type: "http",
      chainType: "l1",
      url: configVariable("BASE_SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    "arbitrum-sepolia": {
      type: "http",
      chainType: "l1",
      url: "https://arbitrum-sepolia-rpc.publicnode.com",
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    "mainnet-sepolia": {
      type: "http",
      chainType: "l1",
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};

export default config;
