function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('oauth_token', (table) => {
      table.bigIncrements('id').primary().notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.text('refresh_token').notNullable();
      table.bigInteger('user_id').notNullable();
      table.uuid('hosting_provider_uuid').notNullable();
      table.unique(['user_id', 'hosting_provider_uuid']);
    }),
  ]);
}

function down(knex) {
    return Promise.all([
        knex.schema.dropTable('oauth_token'),
    ]);
}

module.exports = {
    up,
    down
}