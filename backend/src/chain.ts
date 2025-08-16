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
    feeControllerContract: '0xE3070d3e4309afA3bC9a6b057685743CF42da77C',
    receiverContract: '0x5c3535439A995B3d82F4632a8691c2F17Cc6B57D',
    factoryContract: '0xc1959eBe4D66b153b4c8cB4FECe279517Ea6e375',
    domain: 6,
  },
  11155111: {
    chainId: 11155111,
    chainName: 'Ethereum Sepolia',
    chainCaiP: 'eip155:11155111',
    feeControllerContract: '0x85b03e28Db7179431fcdD49030Af90b0001e3933',
    receiverContract: '0x3aFB4C63DeD70Ed9feB962623Ff27937114e2365',
    factoryContract: '0x7F487aC302218B185d28644d4678F6f454fc023e',
    domain: 6,
  },
  421614: {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    chainCaiP: 'eip155:421614',
    feeControllerContract: '0x85b03e28Db7179431fcdD49030Af90b0001e3933',
    receiverContract: '0x3aFB4C63DeD70Ed9feB962623Ff27937114e2365',
    factoryContract: '0x7F487aC302218B185d28644d4678F6f454fc023e',
    domain: 6,
  },
};

export const CURRENT_CHAIN_IDS = [
  ChainId.ARBITRUM_TESTNET,
  ChainId.ETHEREUM_TESTNET,
  ChainId.BASE_TESTNET,
];
