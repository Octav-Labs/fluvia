import { CreateOptions, DestroyOptions, FindOptions, Model, UpdateOptions } from 'sequelize';

// Interface for database operations
export interface IDatabaseOperations<T extends Model> {
  // Find operations
  findAll(options?: FindOptions): Promise<T[]>;
  findById(id: number | string): Promise<T | null>;
  findOne(options: FindOptions): Promise<T | null>;

  // Create, Update, Delete operations
  create(data: any, options?: CreateOptions): Promise<T>;
  update(data: any, options: UpdateOptions): Promise<[number, T[]]>;
  delete(options: DestroyOptions): Promise<number>;

  // Utility operations
  count(options?: FindOptions): Promise<number>;

  // Database instance access
  getDatabase(): any;
}

// Interface for database connection
export interface IDatabaseConnection {
  testConnection(): Promise<boolean>;
  closeConnection(): Promise<void>;
  getSequelize(): any;
}

// Interface for database configuration
export interface IDatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
  logging: boolean | ((sql: string, timing?: number) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}
