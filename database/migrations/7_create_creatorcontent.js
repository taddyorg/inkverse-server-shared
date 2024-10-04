function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('creatorcontent', (table) => {
      table.bigIncrements('id');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.string('hash');
      table.uuid('content_uuid').notNullable();
      table.string('content_type').notNullable();
      table.uuid('creator_uuid').notNullable();
      table.specificType('roles', 'varchar(255)[]');
      table.integer('position');
      table.integer('content_position');
      table.unique(['content_uuid', 'creator_uuid']);
      table.index(['content_uuid']);
      table.index(['creator_uuid']);
    }),
  ]);
}

function down(knex) {
  return Promise.all([
    knex.schema.dropTable('creatorcontent'),
  ]);
}

module.exports = {
  up,
  down
}