import { User, UserRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class UserFactory extends BaseFactory<User> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Users', dbType);
  }

  // User-specific methods
  async findByAddress(address: string): Promise<User | null> {
    return await this.findOne({ address });
  }

  async findByAddresses(addresses: string[]): Promise<User[]> {
    return await this.findAll({
      address: this.getKnex().raw('? = ANY(?)', [addresses, addresses]),
    });
  }

  async createUser(userData: Partial<UserRecord>): Promise<User> {
    return await this.create(userData);
  }

  async updateUserByAddress(address: string, data: Partial<UserRecord>): Promise<[number, User[]]> {
    return await this.update({ address }, data);
  }

  async deleteUserByAddress(address: string): Promise<number> {
    return await this.delete({ address });
  }

  async userExists(address: string): Promise<boolean> {
    return await this.exists({ address });
  }

  async getUsersByAddresses(addresses: string[]): Promise<User[]> {
    return await this.findAll({
      address: this.getKnex().raw('? = ANY(?)', [addresses, addresses]),
    });
  }
}
