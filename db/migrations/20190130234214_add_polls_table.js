exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('polls', function(table){
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.string('value').notNullable();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('polls')
  ])
};

