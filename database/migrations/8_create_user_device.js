function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('user_device', (table) => {
      table.bigIncrements('id');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.bigInteger('user_id').notNullable();
      table.string('fcm_token').notNullable();
      table.string('platform').notNullable();
      table.boolean('is_provisional');
      table.index(['user_id']);
      table.unique(['user_id', 'fcm_token', 'platform']);
    }),
  ]);
}

function down(knex) {
  return Promise.all([
    knex.schema.dropTable('user_device'),
  ]);
}

module.exports = {
  up,
  down
}