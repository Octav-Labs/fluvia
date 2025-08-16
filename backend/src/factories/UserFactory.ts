import { User, UserRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export const mapRecordToUser = (record: UserRecord): User => {
  return {
    uuid: record.uuid,
    privyUserId: record.privy_user_id,
  };
};
export const mapUserToRecord = (user: User): UserRecord => {
  return {
    uuid: user.uuid,
    privy_user_id: user.privyUserId,
  };
};

export class UserFactory extends BaseFactory<UserRecord> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Users', dbType);
  }

  // Essential find methods with UUIDs and identifiers
  async findByPrivyUserId(privyUserId: string): Promise<User | null> {
    const record = await this.findOne({ privy_user_id: privyUserId });
    return record ? mapRecordToUser(record) : null;
  }
}
