import { Fluvia, FluviaRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class FluviaFactory extends BaseFactory<Fluvia> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByUserUuid(userUuid: string): Promise<Fluvia[]> {
    return await this.findAll({ user_uuid: userUuid });
  }

  async findByContractAddress(contractAddress: string): Promise<Fluvia | null> {
    return await this.findOne({ contract_address: contractAddress });
  }

  async findByReceiverAddress(receiverAddress: string): Promise<Fluvia[]> {
    return await this.findAll({ receiver_address: receiverAddress });
  }

  async findByLabel(label: string): Promise<Fluvia[]> {
    return await this.findAll({ label });
  }
}
