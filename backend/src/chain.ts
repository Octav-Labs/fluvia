export enum ChainId {
  BASE_TESTNET = 84532,
  ETHEREUM_TESTNET = 11155111,
  ARBITRUM_TESTNET = 421614,
  BASE_MAINNET = 8453,
  ETHEREUM_MAINNET = 1,
  ARBITRUM_MAINNET = 42161,
}

export type ChainInfo = {
  chainId: number;
  chainName: string;
  chainCaiP: string;
  feeControllerContract: string;
  receiverContract: string;
  factoryContract: string;
  messageTransmitter: string;
  domain: number;
};

export const chains: Record<number, ChainInfo> = {
  84532: {
    chainId: 84532,
    chainName: 'Base Sepolia',
    chainCaiP: 'eip155:84532',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x93Ac275DCAa8c7F3F103Ce8833ac11f30d73F1b8',
    factoryContract: '0xa4479267c2eB0Da5e5bC05913c6Fd0c8066cf961',
    messageTransmitter: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
    domain: 6,
  },
  11155111: {
    chainId: 11155111,
    chainName: 'Ethereum Sepolia',
    chainCaiP: 'eip155:11155111',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x93Ac275DCAa8c7F3F103Ce8833ac11f30d73F1b8',
    factoryContract: '0xa4479267c2eB0Da5e5bC05913c6Fd0c8066cf961',
    messageTransmitter: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
    domain: 6,
  },
  421614: {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    chainCaiP: 'eip155:421614',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x93Ac275DCAa8c7F3F103Ce8833ac11f30d73F1b8',
    factoryContract: '0xa4479267c2eB0Da5e5bC05913c6Fd0c8066cf961',
    messageTransmitter: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
    domain: 6,
  },
  8453: {
    chainId: 8453,
    chainName: 'Base Mainnet',
    chainCaiP: 'eip155:8453',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x6AA02813552F61c19EA6Eb0BcD08A7aA115bD788',
    factoryContract: '0x1BF169dCBB2004F6D881fa5f380000eaa561F74D',
    messageTransmitter: '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    domain: 6,
  },
  1: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    chainCaiP: 'eip155:1',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x6AA02813552F61c19EA6Eb0BcD08A7aA115bD788',
    factoryContract: '0x1BF169dCBB2004F6D881fa5f380000eaa561F74D',
    messageTransmitter: '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    domain: 6,
  },
  42161: {
    chainId: 42161,
    chainName: 'Arbitrum Mainnet',
    chainCaiP: 'eip155:42161',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x6AA02813552F61c19EA6Eb0BcD08A7aA115bD788',
    messageTransmitter: '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
    factoryContract: '0x1BF169dCBB2004F6D881fa5f380000eaa561F74D',
    domain: 6,
  },
};

export const USDC_CONTRACTS_BY_CHAIN_ID: Record<number, string> = {
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // base mainnet
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Ethereum Sepolia
  1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //   Ethereum Mainnet
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Arbitrum Sepolia
  42161: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // Arbitrum mainnet
};

export const DOMAINS_BY_CHAIN_ID: Record<number, number> = {
  84532: 6,
  11155111: 0,
  421614: 3,
  8453: 6,
  1: 0,
  42161: 3,
};

export const CHAIN_IDS_BY_DOMAIN: Record<number, number> = {
  6: 84532,
  0: 11155111,
  3: 421614,
};

export const CURRENT_CHAIN_IDS = [
  // ChainId.BASE_MAINNET,
  // ChainId.ETHEREUM_MAINNET,
  // ChainId.ARBITRUM_MAINNET,
  ChainId.BASE_TESTNET,
  ChainId.ETHEREUM_TESTNET,
  ChainId.ARBITRUM_TESTNET,
];
