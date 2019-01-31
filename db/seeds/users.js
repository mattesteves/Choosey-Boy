exports.seed = function(knex, Promise) {

  function deleteUsers(){
    return knex('users').del()
  }

  function deletePolls() {
    return knex('polls').del()
  }

  function insertUsers() {
    return knex('users').insert([
      {id: 1, email: 'Alice@gmail.com'},
      {id: 2, email: 'Bob@gmail.com'},
      {id: 3, email: 'Charlie@gmail.com'}
    ])
    .returning('*')
  }

  function insertPolls(users) {
    return knex('polls').insert([
      {id: 1, user_id: users[0].id, value: 'Favourite movie'},
      {id: 2, user_id: users[1].id, value: 'Favourite food'},
      {id: 3, user_id: users[2].id, value: 'Favourite colour'},
    ])
  }

  return deletePolls()
    .then(deleteUsers)
    .then(insertUsers)
    .then(users => insertPolls(users))
};
