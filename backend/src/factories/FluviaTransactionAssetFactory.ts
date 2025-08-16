import { FluviaTransactionAsset, FluviaTransactionAssetRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class FluviaTransactionAssetFactory extends BaseFactory<FluviaTransactionAsset> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Transaction_Assets', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByTransactionUuid(transactionUuid: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ transaction_uuid: transactionUuid });
  }

  async findByFromAddress(fromAddress: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ from: fromAddress });
  }

  async findByToAddress(toAddress: string): Promise<FluviaTransactionAsset[]> {
    return await this.findAll({ to: toAddress });
  }
}
