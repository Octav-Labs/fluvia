import { Knex } from 'knex';

// Generic CRUD interface for all factories
export interface ICRUDOperations<T> {
  // Create operations
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;

  // Read operations
  findById(id: string): Promise<T | null>;
  findOne(where: any): Promise<T | null>;
  findAll(where?: any): Promise<T[]>;
  findAndCountAll(options?: any): Promise<{ rows: T[]; count: number }>;

  // Update operations
  updateById(id: string, data: Partial<T>): Promise<[number, T[]]>;
  update(where: any, data: Partial<T>): Promise<[number, T[]]>;

  // Delete operations
  deleteById(id: string): Promise<number>;
  delete(where: any): Promise<number>;

  // Utility operations
  count(where?: any): Promise<number>;
  exists(where: any): Promise<boolean>;

  // Transaction support
  withTransaction<TResult>(
    callback: (transaction: Knex.Transaction) => Promise<TResult>
  ): Promise<TResult>;
}
