import { Chain, ChainRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class ChainFactory extends BaseFactory<Chain> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Chains', dbType);
  }

  // Chain-specific methods
  async findByChainId(chainId: number): Promise<Chain | null> {
    return await this.findOne({ chain_id: chainId });
  }

  async findBySymbol(symbol: string): Promise<Chain | null> {
    return await this.findOne({ symbol });
  }

  async findByName(name: string): Promise<Chain | null> {
    return await this.findOne({ name });
  }

  async getMainnetChains(): Promise<Chain[]> {
    return await this.findAll({ chain_id: this.getKnex().raw('>= ?', [1]) });
  }

  async getTestnetChains(): Promise<Chain[]> {
    return await this.findAll({ chain_id: this.getKnex().raw('< ?', [1]) });
  }

  async createChain(chainData: Partial<ChainRecord>): Promise<Chain> {
    return await this.create(chainData);
  }

  async updateChainByChainId(
    chainId: number,
    data: Partial<ChainRecord>
  ): Promise<[number, Chain[]]> {
    return await this.update({ chain_id: chainId }, data);
  }

  async deleteChainByChainId(chainId: number): Promise<number> {
    return await this.delete({ chain_id: chainId });
  }

  async chainExists(chainId: number): Promise<boolean> {
    return await this.exists({ chain_id: chainId });
  }
}
