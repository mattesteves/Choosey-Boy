exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('options', function(table){
      table.increments('id').primary();
      table.integer('poll_id').references('id').inTable('polls');
      table.string('value').notNullable();
      table.string('description');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('options')
  ])
};
