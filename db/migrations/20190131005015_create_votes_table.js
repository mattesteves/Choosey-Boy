exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('votes', function(table){
      table.increments('id').primary();
      table.integer('option_id').references('id').inTable('options');
      table.string('user_cookie').notNullable();
      table.integer('point_weight');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('votes')
  ])
};
