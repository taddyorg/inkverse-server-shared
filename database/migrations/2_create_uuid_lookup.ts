import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('uuid_lookup', (table) => {
    table.bigIncrements('id', { primaryKey: false });
    table.uuid('uuid').primary();
    table.string('taddy_type');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
    table.string('priority');
    table.string('priority_reason');
    table.string('header_name');
    table.string('header_value');
    table.string('hash');
    table.bigInteger('hash_timestamp');
    table.index(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('uuid_lookup');
}