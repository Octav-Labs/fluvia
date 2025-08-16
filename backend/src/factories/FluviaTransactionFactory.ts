import { FluviaTransaction, FluviaTransactionRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class FluviaTransactionFactory extends BaseFactory<FluviaTransaction> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Transactions', dbType);
  }

  // Transaction-specific methods
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

  async findByStatus(isError: boolean): Promise<FluviaTransaction[]> {
    return await this.findAll({ is_error: isError ? 1 : 0 });
  }

  async getSuccessfulTransactions(fluviaUuid: string): Promise<FluviaTransaction[]> {
    return await this.findAll({
      fluvia_uuid: fluviaUuid,
      is_error: 0,
    });
  }

  async getFailedTransactions(fluviaUuid: string): Promise<FluviaTransaction[]> {
    return await this.findAll({
      fluvia_uuid: fluviaUuid,
      is_error: 1,
    });
  }

  async createTransaction(
    transactionData: Partial<FluviaTransactionRecord>
  ): Promise<FluviaTransaction> {
    return await this.create(transactionData);
  }

  async updateTransactionByHash(
    hash: string,
    data: Partial<FluviaTransactionRecord>
  ): Promise<[number, FluviaTransaction[]]> {
    return await this.update({ hash }, data);
  }

  async deleteTransactionByHash(hash: string): Promise<number> {
    return await this.delete({ hash });
  }

  async transactionExists(hash: string): Promise<boolean> {
    return await this.exists({ hash });
  }

  async getTransactionsByDateRange(
    fluviaUuid: string,
    startDate: Date,
    endDate: Date
  ): Promise<FluviaTransaction[]> {
    return await this.findAll({
      fluvia_uuid: fluviaUuid,
      created_at: this.getKnex().raw('BETWEEN ? AND ?', [startDate, endDate]),
    });
  }
}
