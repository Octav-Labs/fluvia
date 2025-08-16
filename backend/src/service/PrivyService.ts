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
}
