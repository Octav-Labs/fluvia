import { Fluvia, FluviaRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class FluviaFactory extends BaseFactory<Fluvia> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia', dbType);
  }

  // Fluvia-specific methods
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

  async createFluvia(fluviaData: Partial<FluviaRecord>): Promise<Fluvia> {
    return await this.create(fluviaData);
  }

  async updateFluviaByUuid(uuid: string, data: Partial<FluviaRecord>): Promise<[number, Fluvia[]]> {
    return await this.updateById(uuid, data);
  }

  async deleteFluviaByUuid(uuid: string): Promise<number> {
    return await this.deleteById(uuid);
  }

  async fluviaExists(uuid: string): Promise<boolean> {
    return await this.exists({ uuid });
  }

  async getUserFluvias(userUuid: string): Promise<Fluvia[]> {
    return await this.findByUserUuid(userUuid);
  }

  async getFluviasByContract(contractAddress: string): Promise<Fluvia[]> {
    return await this.findAll({ contract_address: contractAddress });
  }
}
