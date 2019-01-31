exports.seed = function(knex, Promise) {

  function deleteUsers(){
    return knex('users').del()
  }

  function deletePolls() {
    return knex('polls').del()
  }

  function deleteOptions() {
    return knex('options').del()
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
    .returning('*')
  }

  function insertOptions(polls) {
    return knex('options').insert([
      {id: 1, poll_id: polls[0].id, value: 'Airplane', description: 'Leslie Nielsen is great'},
      {id: 2, poll_id: polls[0].id, value: 'The Fellowship of the Ring'},
      {id: 3, poll_id: polls[1].id, value: 'Sushi'},
      {id: 4, poll_id: polls[1].id, value: 'Sunflower Seeds'},
      {id: 5, poll_id: polls[2].id, value: 'Orange', description: 'Clearly the winner'},
      {id: 6, poll_id: polls[2].id, value: 'Blue'}
    ])
    .returning('*')
  }

  return deleteOptions()
    .then(deletePolls)
    .then(deleteUsers)
    .then(insertUsers)
    .then(users => insertPolls(users))
    .then(polls => insertOptions(polls))
};
