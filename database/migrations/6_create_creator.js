function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('creator', (table) => {
      table.bigIncrements('id', { primaryKey: false });
      table.uuid('uuid').primary();
      table.string('source');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.string('hash').unique();
      table.string('content_hash');
      table.string('websub_hash');
      table.bigInteger('date_published');
      table.string('name');
      table.text('bio');
      table.json('avatar_image');
      table.string('country');
      table.specificType('links', 'json[]')
      table.specificType('tags', 'varchar(255)[]')
      table.string('short_url').notNullable().unique();
      table.text('copyright');
      table.text('sss_url').unique();
      table.string('sss_owner_name');
      table.text('sss_owner_public_email');
      table.boolean('is_blocked');
      table.index(['id']);
    }),
  ]);
}

function down(knex) {
  return Promise.all([
    knex.schema.dropTable('creator'),
  ]);
}

module.exports = {
  up,
  down
}