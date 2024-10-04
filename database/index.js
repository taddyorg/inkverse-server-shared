const knex = require('knex');
const knexStringcase = require('knex-stringcase');
const config = require('./config');

const options = knexStringcase(config);
module.exports = knex(options)