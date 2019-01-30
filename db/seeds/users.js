exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'Alice@gmail.com'}),
        knex('users').insert({id: 2, email: 'Bob@gmail.com'}),
        knex('users').insert({id: 3, email: 'Charlie@gmail.com'})
      ]);
    });
};
