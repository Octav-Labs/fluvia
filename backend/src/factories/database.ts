import { dbConfig } from '../config/database';

import { IDatabaseConnection } from './interfaces';

import { Sequelize } from 'sequelize';

// Database factory class
export class DatabaseFactory implements IDatabaseConnection {
  private static instance: DatabaseFactory;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      pool: dbConfig.pool,
    });
  }

  // Singleton pattern
  public static getInstance(): DatabaseFactory {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = new DatabaseFactory();
    }
    return DatabaseFactory.instance;
  }

  // Get Sequelize instance
  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  // Test connection
  public async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  // Close connection
  public async closeConnection(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('✅ Database connection closed successfully.');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
    }
  }
}

// Export singleton instance
export const database = DatabaseFactory.getInstance();
