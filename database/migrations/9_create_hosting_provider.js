function up(knex) {
  return Promise.all([
    knex.schema
    .createTable('hosting_provider', (table) => {
      table.bigIncrements('id', { primaryKey: false });
      table.uuid('uuid').primary();
      table.json('oauth')
      table.timestamp('date_published');
      table.index(['id']);
    }),
  ]);
  }
  
  function down(knex) {
    return Promise.all([
      knex.schema.dropTable('hosting_provider'),
    ]);
  }
  
  module.exports = {
    up,
    down
  }