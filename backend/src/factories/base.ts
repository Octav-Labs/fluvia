import { Knex } from 'knex';

import { DatabaseService, DBConfigurationType } from '../services/DatabaseService';
import { ICRUDOperations } from './interfaces';

// Base factory class that implements CRUD operations using DatabaseService
export abstract class BaseFactory<T> implements ICRUDOperations<T> {
  protected tableName: string;
  protected databaseService: DatabaseService;
  protected dbType: DBConfigurationType;

  constructor(tableName: string, dbType: DBConfigurationType = DBConfigurationType.MAIN) {
    this.tableName = tableName;
    this.databaseService = DatabaseService.getInstance();
    this.dbType = dbType;
  }

  // Get the appropriate Knex client
  protected getKnex(): Knex {
    return this.databaseService.getClient(this.dbType);
  }

  // Create operations
  async create(data: Partial<T>): Promise<T> {
    try {
      const [result] = await this.getKnex()(this.tableName).insert(data).returning('*');
      return result as T;
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const result = await this.getKnex()(this.tableName).insert(data).returning('*');
      return result as T[];
    } catch (error) {
      console.error('Error creating multiple records:', error);
      throw error;
    }
  }

  // Read operations
  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.getKnex()(this.tableName).where('uuid', id).first();
      return (result as T) || null;
    } catch (error) {
      console.error('Error finding record by ID:', error);
      throw error;
    }
  }

  async findOne(where: any): Promise<T | null> {
    try {
      const result = await this.getKnex()(this.tableName).where(where).first();
      return (result as T) || null;
    } catch (error) {
      console.error('Error finding one record:', error);
      throw error;
    }
  }

  async findAll(where?: any): Promise<T[]> {
    try {
      let query = this.getKnex()(this.tableName);
      if (where) {
        query = query.where(where);
      }
      const result = await query;
      return result as T[];
    } catch (error) {
      console.error('Error finding all records:', error);
      throw error;
    }
  }

  async findAndCountAll(options?: any): Promise<{ rows: T[]; count: number }> {
    try {
      let query = this.getKnex()(this.tableName);

      // Apply where conditions if provided
      if (options?.where) {
        query = query.where(options.where);
      }

      // Apply pagination if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.offset(options.offset);
      }

      // Apply ordering if provided
      if (options?.orderBy) {
        query = query.orderBy(options.orderBy.column, options.orderBy.direction || 'asc');
      }

      const rows = await query;
      const countResult = await this.getKnex()(this.tableName).count('* as count').first();
      const count = parseInt((countResult?.count as string) || '0');

      return { rows: rows as T[], count };
    } catch (error) {
      console.error('Error finding and counting records:', error);
      throw error;
    }
  }

  // Update operations
  async updateById(id: string, data: Partial<T>): Promise<[number, T[]]> {
    try {
      const result = await this.getKnex()(this.tableName)
        .where('uuid', id)
        .update(data)
        .returning('*');
      return [result.length, result as T[]];
    } catch (error) {
      console.error('Error updating record by ID:', error);
      throw error;
    }
  }

  async update(where: any, data: Partial<T>): Promise<[number, T[]]> {
    try {
      const result = await this.getKnex()(this.tableName).where(where).update(data).returning('*');
      return [result.length, result as T[]];
    } catch (error) {
      console.error('Error updating records:', error);
      throw error;
    }
  }

  // Delete operations
  async deleteById(id: string): Promise<number> {
    try {
      const result = await this.getKnex()(this.tableName).where('uuid', id).del();
      return result;
    } catch (error) {
      console.error('Error deleting record by ID:', error);
      throw error;
    }
  }

  async delete(where: any): Promise<number> {
    try {
      const result = await this.getKnex()(this.tableName).where(where).del();
      return result;
    } catch (error) {
      console.error('Error deleting records:', error);
      throw error;
    }
  }

  // Utility operations
  async count(where?: any): Promise<number> {
    try {
      let query = this.getKnex()(this.tableName).count('* as count');
      if (where) {
        query = query.where(where);
      }
      const result = await query.first();
      return parseInt((result?.count as string) || '0');
    } catch (error) {
      console.error('Error counting records:', error);
      throw error;
    }
  }

  async exists(where: any): Promise<boolean> {
    try {
      const count = await this.count(where);
      return count > 0;
    } catch (error) {
      console.error('Error checking if record exists:', error);
      throw error;
    }
  }

  // Custom search with query builder
  async searchWith<TResult>(fn: (builder: Knex) => Knex.QueryBuilder): Promise<TResult[]> {
    try {
      const query = fn(this.getKnex());
      const result = await query;
      return result as TResult[];
    } catch (error) {
      console.error('Error in searchWith:', error);
      throw error;
    }
  }

  // Transaction support
  async withTransaction<TResult>(
    callback: (transaction: Knex.Transaction) => Promise<TResult>
  ): Promise<TResult> {
    return this.getKnex().transaction(callback);
  }

  // Get database service
  getDatabaseService(): DatabaseService {
    return this.databaseService;
  }

  // Get table name
  getTableName(): string {
    return this.tableName;
  }

  // Get database type
  getDatabaseType(): DBConfigurationType {
    return this.dbType;
  }
}
