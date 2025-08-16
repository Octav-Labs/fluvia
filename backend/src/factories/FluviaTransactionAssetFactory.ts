import { FluviaTransactionAsset, FluviaTransactionAssetRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class FluviaTransactionAssetFactory extends BaseFactory<FluviaTransactionAsset> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Transaction_Assets', dbType);
  }

  // Transaction Asset-specific methods
  async findByTransactionUuid(transactionUuid: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ transaction_uuid: transactionUuid });
  }

  async findByFromAddress(fromAddress: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ from: fromAddress });
  }

  async findByToAddress(toAddress: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ to: toAddress });
  }

  async findByValueRange(minValue: number, maxValue: number): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({
      value: this.getKnex().raw('BETWEEN ? AND ?', [minValue, maxValue]),
    });
  }

  async findByBalanceRange(
    minBalance: number,
    maxBalance: number
  ): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({
      balance: this.getKnex().raw('BETWEEN ? AND ?', [minBalance, maxBalance]),
    });
  }

  async getAssetsByTransaction(transactionUuid: string): Promise<FluviaTransactionAsset[]> {
    return await this.findByTransactionUuid(transactionUuid);
  }

  async getAssetsByAddress(address: string): Promise<FluviaTransactionAsset[]> {
    const knex = this.getKnex();
    return await knex(this.tableName).where('from', address).orWhere('to', address);
  }

  async createTransactionAsset(
    assetData: Partial<FluviaTransactionAssetRecord>
  ): Promise<FluviaTransactionAsset> {
    return await this.create(assetData);
  }

  async updateTransactionAssetByUuid(
    uuid: string,
    data: Partial<FluviaTransactionAssetRecord>
  ): Promise<[number, FluviaTransactionAsset[]]> {
    return await this.updateById(uuid, data);
  }

  async deleteTransactionAssetByUuid(uuid: string): Promise<number> {
    return await this.deleteById(uuid);
  }

  async transactionAssetExists(uuid: string): Promise<boolean> {
    return await this.exists({ uuid });
  }

  async getTotalValueByTransaction(transactionUuid: string): Promise<number> {
    const assets = await this.findByTransactionUuid(transactionUuid);
    return assets.reduce((total, asset) => total + (asset.value || 0), 0);
  }

  async getAssetsByValueThreshold(threshold: number): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({
      value: this.getKnex().raw('>= ?', [threshold]),
    });
  }
}
