function up(knex) {
  return Promise.all([
    knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', (table) => {
      table.bigIncrements('id');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at');
      table.string('name');
      table.text('email').unique();
      table.string('username').unique();
      table.boolean('is_email_verified').defaultTo(false);
      table.string('reset_password_token');
      table.bigInteger('reset_password_expiry_timestamp');
      table.specificType('countries', 'varchar(255)[]');
      table.specificType('languages', 'varchar(255)[]');
      table.specificType('platforms', 'varchar(255)[]');
      table.specificType('genres', 'varchar(255)[]');
      table.string('timezone');
      table.text('profile_image_url');
      table.index(['id']);
    }),
  ]);
}

function down(knex) {
  return Promise.all([
    knex.schema.dropTable('users'),
  ]);
}

module.exports = {
  up,
  down
}