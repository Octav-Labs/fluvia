const { config } = require('dotenv');

config();

const knexConfig: any = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fluvia',
      user: process.env.DB_USER || 'fluvia_user',
      password: process.env.DB_PASSWORD || 'fluvia_password',
    },
    pool: {
      min: 2,
      max: 10,
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
    debug: true,
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_TEST_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_TEST_PORT || process.env.DB_PORT || '5432'),
      database: process.env.DB_TEST_NAME || 'fluvia_test',
      user: process.env.DB_TEST_USER || process.env.DB_USER || 'fluvia_user',
      password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || 'fluvia_password',
    },
    pool: {
      min: 2,
      max: 10,
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
    debug: false,
  },
};

// Only add production config if all required env vars are present
if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) {
  knexConfig.production = {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
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
    debug: false,
  };
}

module.exports = knexConfig;
