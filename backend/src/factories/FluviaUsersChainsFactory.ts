import { FluviaUsersChains, FluviaUsersChainsRecord } from '../models/interfaces';
import { DBConfigurationType } from '../services/DatabaseService';

import { BaseFactory } from './base';

export class FluviaUsersChainsFactory extends BaseFactory<FluviaUsersChains> {
  constructor(dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    super('Fluvia_Users_Chains', dbType);
  }

  // Junction table specific methods
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

  async createRelationship(data: Partial<FluviaUsersChainsRecord>): Promise<FluviaUsersChains> {
    return await this.create(data);
  }

  async deleteRelationship(
    fluviaUuid: string,
    userUuid: string,
    chainUuid: string
  ): Promise<number> {
    return await this.delete({
      fluvia_uuid: fluviaUuid,
      user_uuid: userUuid,
      chain_uuid: chainUuid,
    });
  }

  async relationshipExists(
    fluviaUuid: string,
    userUuid: string,
    chainUuid: string
  ): Promise<boolean> {
    return await this.exists({
      fluvia_uuid: fluviaUuid,
      user_uuid: userUuid,
      chain_uuid: chainUuid,
    });
  }

  async getUserChains(userUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findByUserUuid(userUuid);
  }

  async getFluviaChains(fluviaUuid: string): Promise<FluviaUsersChains[]> {
    return await this.findByFluviaUuid(fluviaUuid);
  }
}
