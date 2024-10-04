require('dotenv').config({ path: `${__dirname.split("/").slice(0, -2).join("/")}/.env` })
const path = require("path");

const connectionString = process.env.DATABASE_URL || `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ENDPOINT}:5432/${process.env.DATABASE_NAME}`;

const pgDetails = {
  client: 'pg',
  version: "13.16",
  searchPath: ['knex', 'public'],
  useNullAsDefault: true,
  connection:{
    connectionString
  },
  pool: { min: 0, max: 20 },
  acquireConnectionTimeout: 1800000,
  migrations: {
		directory: path.resolve(__dirname, "migrations"),
		tableName: "migrations"
	},
}

module.exports = {
  ...pgDetails
}
