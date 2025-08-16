import { PrivyClient } from '@privy-io/server-auth';
import { chains } from '../chain';

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

  async deployFluvia(
    walletId: string,
    chainId: number,
    fluviaOwner: string,
    destDomain: number,
    destRecipient: string
  ) {
    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not found`);
    }

    console.log(walletId, 'walletId');
    console.log(chainId, 'chainId');
    console.log(fluviaOwner, 'fluviaOwner');
    console.log(destDomain, 'destDomain');
    console.log(destRecipient, 'destRecipient');

    // Function signature for deploy: deploy(address,uint32,address)
    // Function selector: 0x67644a5c (first 4 bytes of keccak256 hash)
    const functionSelector = '0x67644a5c';

    // Encode the parameters
    // address: 20 bytes, padded to 32 bytes
    // uint32: 4 bytes, padded to 32 bytes
    // address: 20 bytes, padded to 32 bytes
    const encodedParams = this.encodeDeployParams(fluviaOwner, destDomain, destRecipient);

    try {
      const { hash, caip2 } = await this.privy.walletApi.ethereum.sendTransaction({
        walletId: walletId,
        caip2: chain.chainCaiP as `eip155:${string}`,
        transaction: {
          to: chain.factoryContract as `0x${string}`,
          value: '0x0',
          chainId: chain.chainId,
          data: (functionSelector + encodedParams) as `0x${string}`,
        },
      });

      return { hash, caip2 };
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
        throw new Error('PARAMETER_ERROR: Invalid contract parameters provided');
      }

      // Generic error for unknown issues
      throw new Error(`DEPLOYMENT_ERROR: ${errorMessage}`);
    }
  }

  private encodeDeployParams(
    fluviaOwner: string,
    destDomain: number,
    destRecipient: string
  ): string {
    // Remove '0x' prefix if present
    const cleanOwner = fluviaOwner.replace('0x', '');
    const cleanRecipient = destRecipient.replace('0x', '');

    // Pad addresses to 32 bytes (64 hex characters)
    const paddedOwner = cleanOwner.padStart(64, '0');
    const paddedRecipient = cleanRecipient.padStart(64, '0');

    // Convert destDomain to hex and pad to 32 bytes
    const domainHex = destDomain.toString(16);
    const paddedDomain = domainHex.padStart(64, '0');

    // Concatenate all parameters
    return paddedOwner + paddedDomain + paddedRecipient;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    txHash: string,
    chainId: number
  ): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    gasUsed?: string;
    error?: string;
  }> {
    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not found`);
    }

    try {
      // This would need to be implemented based on your RPC provider
      // For now, returning a basic structure
      return {
        status: 'pending',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`TRANSACTION_STATUS_ERROR: ${errorMessage}`);
    }
  }
}
