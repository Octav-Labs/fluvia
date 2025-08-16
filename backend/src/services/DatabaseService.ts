import 'dotenv/config';

import { Knex, knex } from 'knex';

import { Logger } from '../utils/logger';

export enum DBConfigurationType {
  MAIN = 'MAIN',
  TEST = 'TEST',
}

export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl?: boolean;
}

export class DatabaseService {
  private mainClient: Knex;
  private testClient: Knex;
  private logger = Logger.getLogger();

  private static instance: DatabaseService;

  private constructor(
    mainDbConfig: DatabaseConfig = {
      user: this.getMandatoryEnvValue('DB_USER'),
      password: this.getMandatoryEnvValue('DB_PASSWORD'),
      host: this.getMandatoryEnvValue('DB_HOST'),
      port: this.getEnvNumber('DB_PORT'),
      database: this.getMandatoryEnvValue('DB_NAME'),
      ssl: this.getEnvValue('DB_SSL', 'false').toLowerCase() === 'true',
    },
    testDbConfig: DatabaseConfig = {
      user: this.getEnvValue('DB_TEST_USER', mainDbConfig.user),
      password: this.getEnvValue('DB_TEST_PASSWORD', mainDbConfig.password),
      host: this.getEnvValue('DB_TEST_HOST', mainDbConfig.host),
      port: this.getEnvNumber('DB_TEST_PORT', mainDbConfig.port),
      database: this.getEnvValue('DB_TEST_NAME', 'fluvia_test'),
      ssl: false,
    }
  ) {
    this.logger.info('Initializing DatabaseService');

    // Create main client
    this.mainClient = this.createKnexClient(mainDbConfig, 'main');
    this.logger.info('Main database client initialized');

    // Create test client
    this.testClient = this.createKnexClient(testDbConfig, 'test');
    this.logger.info('Test database client initialized');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private createKnexClient(config: DatabaseConfig, clientType: string): Knex {
    const knexConfig: Knex.Config = {
      client: 'postgresql',
      connection: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: 2,
        max: 20,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
      migrations: {
        directory: './src/migrations',
        tableName: 'knex_migrations',
      },
      seeds: {
        directory: './src/seeds',
      },
      debug: process.env.NODE_ENV === 'development',
    };

    const client = knex(knexConfig);

    // Add error handling
    client.on('error', error => {
      this.logger.error(`Database client error (${clientType}):`, error);
    });

    return client;
  }

  public getClient(dbConfigurationType: DBConfigurationType = DBConfigurationType.MAIN): Knex {
    switch (dbConfigurationType) {
      case DBConfigurationType.MAIN:
        return this.mainClient;
      case DBConfigurationType.TEST:
        return this.testClient;
      default:
        return this.mainClient;
    }
  }

  public async testConnection(
    dbConfigurationType: DBConfigurationType = DBConfigurationType.MAIN
  ): Promise<boolean> {
    try {
      const client = this.getClient(dbConfigurationType);
      await client.raw('SELECT 1');
      this.logger.info(`Database connection test successful for ${dbConfigurationType}`);
      return true;
    } catch (error) {
      this.logger.error(`Database connection test failed for ${dbConfigurationType}:`, error);
      return false;
    }
  }

  public async closeConnections(): Promise<void> {
    try {
      await Promise.all([this.mainClient.destroy(), this.testClient.destroy()]);
      this.logger.info('All database connections closed');
    } catch (error) {
      this.logger.error('Error closing database connections:', error);
    }
  }

  public async runMigrations(
    dbConfigurationType: DBConfigurationType = DBConfigurationType.MAIN
  ): Promise<void> {
    try {
      const client = this.getClient(dbConfigurationType);
      await client.migrate.latest();
      this.logger.info(`Migrations completed successfully for ${dbConfigurationType}`);
    } catch (error) {
      this.logger.error(`Migration failed for ${dbConfigurationType}:`, error);
      throw error;
    }
  }

  public async rollbackMigrations(
    dbConfigurationType: DBConfigurationType = DBConfigurationType.MAIN
  ): Promise<void> {
    try {
      const client = this.getClient(dbConfigurationType);
      await client.migrate.rollback();
      this.logger.info(`Migrations rolled back successfully for ${dbConfigurationType}`);
    } catch (error) {
      this.logger.error(`Migration rollback failed for ${dbConfigurationType}:`, error);
      throw error;
    }
  }

  public async runSeeds(
    dbConfigurationType: DBConfigurationType = DBConfigurationType.MAIN
  ): Promise<void> {
    try {
      const client = this.getClient(dbConfigurationType);
      await client.seed.run();
      this.logger.info(`Seeds completed successfully for ${dbConfigurationType}`);
    } catch (error) {
      this.logger.error(`Seeds failed for ${dbConfigurationType}:`, error);
      throw error;
    }
  }

  // Environment variable helpers
  private getMandatoryEnvValue(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing mandatory environment variable: ${key}`);
    }
    return value;
  }

  private getEnvValue(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getEnvNumber(key: string, defaultValue: number = 5432): number {
    const value = process.env[key];
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return defaultValue;
    return parsed;
  }

  // Get specific clients
  public getMainClient(): Knex {
    return this.mainClient;
  }

  public getTestClient(): Knex {
    return this.testClient;
  }
}
