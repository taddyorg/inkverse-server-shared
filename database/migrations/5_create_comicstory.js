function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('comicstory', (table) => {
      table.bigIncrements('id', { primaryKey: false });
      table.uuid('uuid').primary();
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.string('hash').unique();
      table.uuid('series_uuid').notNullable();
      table.uuid('issue_uuid').notNullable();
      table.integer('position');
      table.integer('width');
      table.integer('height');
      table.json('story_image');
      table.boolean('is_removed');
      table.index(['id']);
      table.index(['series_uuid']);
      table.index(['issue_uuid']);
    }),
  ]);
}

function down(knex) {
  return Promise.all([
    knex.schema.dropTable('comicstory'),
  ]);
}

module.exports = {
  up,
  down
}