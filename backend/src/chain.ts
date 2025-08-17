export enum ChainId {
  BASE_TESTNET = 84532,
  ETHEREUM_TESTNET = 11155111,
  ARBITRUM_TESTNET = 421614,
}

export type ChainInfo = {
  chainId: number;
  chainName: string;
  chainCaiP: string;
  feeControllerContract: string;
  receiverContract: string;
  factoryContract: string;
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
    domain: 6,
  },
  11155111: {
    chainId: 11155111,
    chainName: 'Ethereum Sepolia',
    chainCaiP: 'eip155:11155111',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x93Ac275DCAa8c7F3F103Ce8833ac11f30d73F1b8',
    factoryContract: '0xa4479267c2eB0Da5e5bC05913c6Fd0c8066cf961',
    domain: 6,
  },
  421614: {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    chainCaiP: 'eip155:421614',
    feeControllerContract: '0x8C31f4B7c6b44DA2e8996e279D5F08C00044f81D',
    receiverContract: '0x93Ac275DCAa8c7F3F103Ce8833ac11f30d73F1b8',
    factoryContract: '0xa4479267c2eB0Da5e5bC05913c6Fd0c8066cf961',
    domain: 6,
  },
};

export const CURRENT_CHAIN_IDS = [
  ChainId.ARBITRUM_TESTNET,
  ChainId.ETHEREUM_TESTNET,
  ChainId.BASE_TESTNET,
];
