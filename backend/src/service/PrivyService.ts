import { PrivyClient } from '@privy-io/server-auth';
import { chains } from '../chain';
import { factoryAbi } from '../abi/factory';
import { ethers } from 'ethers';

export class PrivyService {
  private privy: PrivyClient;

  constructor() {
    if (
      !process.env.PRIVY_APP_ID ||
      !process.env.PRIVY_APP_SECRET ||
      !process.env.PRIVY_PRIVATE_KEY
    ) {
      throw new Error('Missing Privy environment variables');
    }

    this.privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!, {
      walletApi: {
        authorizationPrivateKey: process.env.PRIVY_PRIVATE_KEY!,
      },
    });
  }

  async deployFluvia(walletId: string, chainId: number, destDomain: number, destRecipient: string) {
    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not found`);
    }

    try {
      const iface = new ethers.Interface(factoryAbi);
      const address = await this.privy.walletApi.getWallet({ id: walletId });
      const data = iface.encodeFunctionData('deploy', [address.address, destDomain, destRecipient]);

      const transactionRequest = {
        to: chain.factoryContract as `0x${string}`,
        chainId: chain.chainId,
        data: data as `0x${string}`,
      };

      const { hash, caip2 } = await this.privy.walletApi.ethereum.sendTransaction({
        walletId: walletId,
        caip2: chain.chainCaiP as `eip155:${string}`,
        transaction: transactionRequest,
      });

      return hash;
    } catch (error) {
      // Handle specific Privy and blockchain errors
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check for insufficient gas/balance errors
      if (
        errorMessage.includes('insufficient funds') ||
        errorMessage.includes('insufficient balance') ||
        errorMessage.includes('gas required exceeds allowance') ||
        errorMessage.includes('out of gas')
      ) {
        throw new Error(
          'INSUFFICIENT_GAS: Wallet does not have enough gas to complete the transaction'
        );
      }

      // Check for network/RPC errors
      if (
        errorMessage.includes('network') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('RPC')
      ) {
        console.log(errorMessage, 'errorMessage');
        throw new Error('NETWORK_ERROR: Unable to connect to blockchain network');
      }

      // Check for contract-specific errors
      if (
        errorMessage.includes('execution reverted') ||
        errorMessage.includes('revert') ||
        errorMessage.includes('invalid opcode')
      ) {
        throw new Error('CONTRACT_ERROR: Transaction reverted by smart contract');
      }

      // Check for wallet/authentication errors
      if (
        errorMessage.includes('wallet') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('authentication')
      ) {
        throw new Error('WALLET_ERROR: Wallet authentication or access issue');
      }

      // Check for parameter validation errors
      if (errorMessage.includes('invalid address') || errorMessage.includes('invalid parameter')) {
        console.log(errorMessage, 'errorMessage');
        throw new Error('PARAMETER_ERROR: Invalid contract parameters provided');
      }

      // Generic error for unknown issues
      throw new Error(`DEPLOYMENT_ERROR: ${errorMessage}`);
    }
  }

  /**
   * Get deployed contract address from transaction hash
   * This method uses ethers.js to get the transaction receipt
   */
  async getDeployedContractAddress(
    txHash: string,
    chainId: number
  ): Promise<{
    contractAddress: string | null;
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    gasUsed?: string;
  }> {
    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not found`);
    }

    try {
      // Create ethers provider
      const rpcUrl = this.getRpcUrl(chainId);
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Get transaction receipt
      const receipt = await provider.getTransactionReceipt(txHash);
      const test = await provider.getTransaction(txHash);
      const data = test?.data;
      const iface = new ethers.Interface(factoryAbi);
      const decodedData = iface.decodeFunctionData('deploy', data as `0x${string}`);
      console.log(decodedData, 'decodedData');
      console.log(test, 'tx');

      if (!receipt) {
        return {
          contractAddress: null,
          status: 'pending',
        };
      }

      // Check if transaction was successful
      if (receipt.status === 0) {
        return {
          contractAddress: null,
          status: 'failed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
        };
      }

      // For contract creation, the contract address is in the 'contractAddress' field
      const contractAddress = receipt.contractAddress || null;
      console.log(receipt, 'receipt');
      return {
        contractAddress,
        status: 'confirmed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`CONTRACT_ADDRESS_ERROR: ${errorMessage}`);
    }
  }

  /**
   * Get RPC URL for the given chain
   */
  private getRpcUrl(chainId: number): string {
    switch (chainId) {
      case 84532: // Base Sepolia
        return process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
      case 8453: // Base Mainnet
        return process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';
      default:
        throw new Error(`No RPC URL configured for chain ID ${chainId}`);
    }
  }
}
