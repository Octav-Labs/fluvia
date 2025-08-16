import { IDatabaseConfig } from '../factories/interfaces';

import dotenv from 'dotenv';

dotenv.config();

// Simple database configuration for development
export const dbConfig: IDatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fluvia',
  username: process.env.DB_USER || 'fluvia_user',
  password: process.env.DB_PASSWORD || 'fluvia_password',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
