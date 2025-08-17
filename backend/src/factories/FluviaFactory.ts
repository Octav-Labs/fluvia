import { Fluvia, FluviaRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export const mapRecordToFluvia = (record: FluviaRecord): Fluvia => {
  const fluvia: Fluvia = {
    uuid: record.uuid,
    userUuid: record.user_uuid,
  };

  if (record.contract_address) fluvia.contractAddress = record.contract_address;
  if (record.label) fluvia.label = record.label;
  if (record.receiver_address) fluvia.receiverAddress = record.receiver_address;

  return fluvia;
};

export const mapFluviaToRecord = (fluvia: Fluvia): FluviaRecord => {
  const record: FluviaRecord = {
    uuid: fluvia.uuid,
    user_uuid: fluvia.userUuid,
  };

  if (fluvia.contractAddress) record.contract_address = fluvia.contractAddress;
  if (fluvia.label) record.label = fluvia.label;
  if (fluvia.receiverAddress) record.receiver_address = fluvia.receiverAddress;

  return record;
};

export class FluviaFactory extends BaseFactory<FluviaRecord> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByUserUuid(userUuid: string): Promise<Fluvia[]> {
    const records = await this.findAll({ user_uuid: userUuid });
    return records.map(mapRecordToFluvia);
  }

  async findByContractAddress(contractAddress: string): Promise<Fluvia | null> {
    const record = await this.findOne({ contract_address: contractAddress });
    return record ? mapRecordToFluvia(record) : null;
  }

  async findByReceiverAddress(receiverAddress: string): Promise<Fluvia[]> {
    const records = await this.findAll({ receiver_address: receiverAddress });
    return records.map(mapRecordToFluvia);
  }

  async findByLabel(label: string): Promise<Fluvia[]> {
    const records = await this.findAll({ label });
    return records.map(mapRecordToFluvia);
  }

  async getAll(): Promise<Fluvia[]> {
    const records = await this.findAll();
    return records.map(mapRecordToFluvia);
  }
}
