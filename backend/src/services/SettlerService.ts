import { FluviaFactory } from '../factories';
import { ChainInfo, CURRENT_CHAIN_IDS, USDC_CONTRACTS_BY_CHAIN_ID } from '../chain';
import { Fluvia } from '../models/interfaces';
import { RPCService } from './RPCService';
import { erc20Abi, getAddress } from 'viem';
import { PrivyService } from '../service/PrivyService';

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

    const fluviaByContractMap: Map<string, Fluvia> = new Map(
      filteredFluvias.map(fluvia => [fluvia.contractAddress as string, fluvia])
    );

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

  async settleAllFluvias(fluviasMap: Map<number, Fluvia[]>) {
    for (const [chainId, fluvias] of fluviasMap) {
      if (fluvias.length === 0) continue;
      for (const fluvia of fluvias) {
        const hash = await this.privyService.settleFluvia(fluvia, chainId);
        if (!hash) continue;

        console.log(`Settled ${fluvia.contractAddress} on chain ${chainId} with tx hash ${hash}`);

        // TODO: poll for bridge
      }
    }
  }
}
