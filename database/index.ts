import knex from 'knex';
import knexStringcase from 'knex-stringcase';
import config from './config.js';

const options = knexStringcase(config);
export default knex(options)