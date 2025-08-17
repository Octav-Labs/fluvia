import { PrivyClient } from '@privy-io/server-auth';
import { chains } from '../chain';
import { factoryAbi } from '../abi/factory';
import { ethers } from 'ethers';
import { RPCService } from '../services/RPCService';
import { Fluvia } from '../models/interfaces';
import { receiverAbi } from '../abi/receiverAbi';

export class PrivyService {
  private privy: PrivyClient;
  private SERVER_WALLET_ID = process.env.PRIVY_WALLET_ID!;

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

      const { hash } = await this.privy.walletApi.ethereum.sendTransaction({
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
   * Read the next contract address that will be deployed for a given owner
   * This uses the computeAddressForNext function from the factory contract
   */
  async readNextContractAddress(walletId: string, chainId: number): Promise<string> {
    const chain = chains[chainId];
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not found`);
    }

    try {
      const provider = new ethers.JsonRpcProvider(RPCService.getRpcUrl(chainId));
      const address = await this.privy.walletApi.getWallet({ id: walletId });
      // Create interface and encode the function call
      const iface = new ethers.Interface(factoryAbi);
      const data = iface.encodeFunctionData('computeAddressForNext', [address.address]);

      // Call the contract
      const result = await provider.call({
        to: chain.factoryContract as `0x${string}`,
        data: data,
      });

      // Decode the result
      const decodedResult = iface.decodeFunctionResult('computeAddressForNext', result);
      const nextAddress = decodedResult[0] as string;

      return nextAddress as string;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`COMPUTE_ADDRESS_ERROR: ${errorMessage}`);
    }
  }

  async settleFluvia(fluvia: Fluvia, chainId: number) {
    try {
      const chain = chains[chainId];
      // const address = await this.privy.walletApi.getWallet({ id: this.SERVER_WALLET_ID });
      const iface = new ethers.Interface(receiverAbi);
      const data = iface.encodeFunctionData('settle');

      const transactionRequest = {
        to: fluvia.contractAddress as `0x${string}`,
        chainId: chainId,
        data: data as `0x${string}`,
      };

      const { hash } = await this.privy.walletApi.ethereum.sendTransaction({
        walletId: this.SERVER_WALLET_ID,
        caip2: chain?.chainCaiP as `eip155:${string}`,
        transaction: transactionRequest,
      });

      return hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('failed to sette fluvia', errorMessage);
      return null;
    }
  }
}
