import { FluviaTransaction, FluviaTransactionRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class FluviaTransactionFactory extends BaseFactory<FluviaTransaction> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Transactions', dbType);
  }

  // Essential find methods with UUIDs
  async findByFluviaUuid(fluviaUuid: string): Promise<FluviaTransaction[]> {
    return await this.findAll({ fluvia_uuid: fluviaUuid });
  }

  async findByUserUuid(userUuid: string): Promise<FluviaTransaction[]> {
    return await this.findAll({ user_uuid: userUuid });
  }

  async findByChainUuid(chainUuid: string): Promise<FluviaTransaction[]> {
    return await this.findAll({ chain_uuid: chainUuid });
  }

  async findByHash(hash: string): Promise<FluviaTransaction | null> {
    return await this.findOne({ hash });
  }

  async findByBlockNumber(blockNumber: number): Promise<FluviaTransaction[]> {
    return await this.findAll({ block_number: blockNumber });
  }
}
