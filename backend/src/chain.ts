export enum ChainId {
  BASE_SEPOLIA = 84532,
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
};

export const CURRENT_CHAIN_ID = ChainId.BASE_SEPOLIA;
