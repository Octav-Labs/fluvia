import { User, UserRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class UserFactory extends BaseFactory<User> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Users', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByAddress(address: string): Promise<User | null> {
    return await this.findOne({ address });
  }

  async findByAddresses(addresses: string[]): Promise<User[]> {
    return await this.findAll({
      address: this.getKnex().raw('? = ANY(?)', [addresses, addresses]),
    });
  }
}
