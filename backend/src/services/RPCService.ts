import { ethers } from 'ethers';
import { Chain, createPublicClient, http } from 'viem';
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, sepolia } from 'viem/chains';

export class RPCService {
  /**
   * Get RPC URL for the given chain
   */
  static getRpcUrl(chainId: number): string {
    switch (chainId) {
      case 84532: // Base Sepolia
        return 'https://sepolia.base.org';
      case 8453: // Base Mainnet
        return 'https://base.llamarpc.com';
      case 11155111: // Ethereum Sepolia
        return 'https://sepolia.drpc.org';
      case 1: // Ethereum Mainnet
        return 'https://eth.llamarpc.com';
      case 421614: // Arbitrum Sepolia
        return 'https://api.zan.top/arb-sepolia';
      case 42161: // Arbitrum Mainnet
        return 'https://arbitrum.drpc.org';
      default:
        throw new Error(`No RPC URL configured for chain ID ${chainId}`);
    }
  }

  /**
   * Get RPC URL for the given chain
   */
  static getViemChain(chainId: number): Chain {
    switch (chainId) {
      case 84532: // Base Sepolia
        return baseSepolia;
      case 8453: // Base Mainnet
        return base;
      case 11155111: // Ethereum Sepolia
        return sepolia;
      case 1: // Ethereum Mainnet
        return mainnet;
      case 421614: // Arbitrum Sepolia
        return arbitrumSepolia;
      case 42161: // Arbitrum Mainnet
        return arbitrum;
      default:
        throw new Error(`No RPC URL configured for chain ID ${chainId}`);
    }
  }

  static getProvider(chainId: number): ethers.JsonRpcProvider {
    const provider = new ethers.JsonRpcProvider(this.getRpcUrl(chainId));
    return provider;
  }

  static getViemProvider(chainId: number) {
    const client = createPublicClient({
      chain: this.getViemChain(chainId),
      transport: http(),
    });
    return client;
  }
}
