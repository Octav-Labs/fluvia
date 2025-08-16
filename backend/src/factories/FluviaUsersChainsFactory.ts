import { FluviaUsersChains } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';
import { BaseFactory } from './base';

export class FluviaUsersChainsFactory extends BaseFactory<FluviaUsersChains> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Users_Chains', dbType);
  }

  // Essential find methods with UUIDs
  async findByFluviaUuid(fluviaUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findAll({ fluvia_uuid: fluviaUuid });
  }

  async findByUserUuid(userUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findAll({ user_uuid: userUuid });
  }

  async findByChainUuid(chainUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findAll({ chain_uuid: chainUuid });
  }

  async findByFluviaAndUser(fluviaUuid: string, userUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findAll({
      fluvia_uuid: fluviaUuid,
      user_uuid: userUuid,
    });
  }

  async findByFluviaAndChain(fluviaUuid: string, chainUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findAll({
      fluvia_uuid: fluviaUuid,
      chain_uuid: chainUuid,
    });
  }
}
