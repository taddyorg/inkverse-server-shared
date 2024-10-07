import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Construct the connection string
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ENDPOINT}:5432/${process.env.DATABASE_NAME}`;

// Define the type and create the configuration object in one go
const config = {
  client: 'pg',
  version: '13.16',
  searchPath: ['knex', 'public'],
  useNullAsDefault: true,
  connection: {
    connectionString,
  },
  pool: { min: 0, max: 20 },
  acquireConnectionTimeout: 1800000,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'migrations',
  },
} as const;

export default config;