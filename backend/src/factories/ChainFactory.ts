import { Chain, ChainRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class ChainFactory extends BaseFactory<Chain> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Chains', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByChainId(chainId: number): Promise<Chain | null> {
    return await this.findOne({ chain_id: chainId });
  }

  async findBySymbol(symbol: string): Promise<Chain | null> {
    return await this.findOne({ symbol });
  }

  async findByName(name: string): Promise<Chain | null> {
    return await this.findOne({ name });
  }
}
