import { FluviaFactory } from '../factories';
import { CURRENT_CHAIN_IDS, DOMAINS_BY_CHAIN_ID, USDC_CONTRACTS_BY_CHAIN_ID } from '../chain';
import { Fluvia } from '../models/interfaces';
import { RPCService } from './RPCService';
import { getAddress } from 'viem';
import { PrivyService } from '../service/PrivyService';
import axios from 'axios';

export type CircleIrisMessage = {
  message: string;
  attestation: string;
  status: string;
  decodedMessage: {
    sourceDomain: string;
    destinationDomain: string;
  };
};

export class SettlerService {
  static minAmountToSettle = 1n * 10n ** 6n;

  constructor(
    private readonly fluviaFactory = new FluviaFactory(),
    private readonly privyService = new PrivyService()
  ) {}

  async processSettlements() {
    const fluvias = await this.fluviaFactory.getAll();
    const filteredFluvias = fluvias.filter(fluvia => fluvia.contractAddress !== undefined);

    const chainIds = CURRENT_CHAIN_IDS;

    const fluviasToSettleByChainIds = new Map<number, Fluvia[]>();

    for (const chainId of chainIds) {
      const provider = RPCService.getViemProvider(chainId);
      const usdcContract = USDC_CONTRACTS_BY_CHAIN_ID[chainId];

      if (!usdcContract) {
        continue;
      }

      const results = await provider.multicall({
        contracts: filteredFluvias.map(fluvia => ({
          address: getAddress(usdcContract),
          abi: [
            {
              type: 'function',
              name: 'balanceOf',
              stateMutability: 'view',
              inputs: [
                {
                  name: 'account',
                  type: 'address',
                },
              ],
              outputs: [
                {
                  type: 'uint256',
                },
              ],
            },
          ] as const,
          functionName: 'balanceOf',
          args: [getAddress(fluvia.contractAddress as string)],
        })),
      });

      console.log(results, chainId);

      const toSettle: Fluvia[] = [];

      results.forEach((result, index) => {
        if (result.status !== 'success') return;
        if (result.result === 0n) return;
        if (result.result < SettlerService.minAmountToSettle) return;

        toSettle.push(filteredFluvias[index] as Fluvia);
      });

      if (toSettle.length === 0) continue;
      fluviasToSettleByChainIds.set(chainId, toSettle);
    }

    await this.settleAllFluvias(fluviasToSettleByChainIds);
  }

  private async settleAllFluvias(fluviasMap: Map<number, Fluvia[]>) {
    const allSettlements = [];

    for (const [chainId, fluvias] of fluviasMap) {
      if (fluvias.length === 0) continue;

      for (const fluvia of fluvias) {
        allSettlements.push(this.settleSingleFluvia(fluvia, chainId));
      }
    }

    await Promise.all(allSettlements);
  }

  private async settleSingleFluvia(fluvia: Fluvia, chainId: number) {
    const hash = await this.privyService.settleFluvia(fluvia, chainId);
    if (!hash) return;

    const message = await this.retrieveAttestation(hash, chainId);
    await this.privyService.callReceiveMessage(message);

    console.log(`Settled ${fluvia.contractAddress} on chain ${chainId} with tx hash ${hash}`);
  }

  //shitty code copied from circle
  async retrieveAttestation(
    transactionHash: string,
    sourceChainId: number
  ): Promise<CircleIrisMessage> {
    const domain = DOMAINS_BY_CHAIN_ID[sourceChainId];

    console.log(`Retrieving attestation for ${transactionHash}...`);
    const url = `https://iris-api-sandbox.circle.com/v2/messages/${domain}?transactionHash=${transactionHash}`;
    while (true) {
      try {
        const response = await axios.get<{ messages: CircleIrisMessage[] }>(url);

        if (response.status === 404) {
          console.log(`Waiting for attestation ${transactionHash}...`);
        }

        if (response.data?.messages?.[0]?.status === 'complete') {
          console.log(`Attestation retrieved successfully for ${transactionHash}!`);
          return response.data.messages[0];
        }
        console.log(`Waiting for attestation ${transactionHash}...`);
        await new Promise(resolve => global.setTimeout(resolve, 5000));
      } catch (error: any) {
        console.error(`Error fetching attestation for ${transactionHash}:`, error?.message);
        await new Promise(resolve => global.setTimeout(resolve, 5000));
      }
    }
  }
}
