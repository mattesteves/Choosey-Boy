exports.seed = function(knex, Promise) {

  function deleteUsers(){
    return knex('users').del();
  }

  function deletePolls() {
    return knex('polls').del();
  }

  function deleteOptions() {
    return knex('options').del();
  }

  function deleteVotes() {
    return knex('votes').del();
  }

  function insertUsers() {
    return knex('users').insert([
      {email: 'Alice@gmail.com'},
      {email: 'Bob@gmail.com'},
      {email: 'Charlie@gmail.com'}
    ])
    .returning('*')
  }

  function insertPolls(users) {
    return knex('polls').insert([
      {user_id: users[0].id, value: 'Favourite movie'},
      {user_id: users[1].id, value: 'Favourite food'},
      {user_id: users[2].id, value: 'Favourite colour'},
    ])
    .returning('*')
  }

  function insertOptions(polls) {
    return knex('options').insert([
      {poll_id: polls[0].id, value: 'Airplane', description: 'Leslie Nielsen is great'},
      {poll_id: polls[0].id, value: 'The Fellowship of the Ring'},
      {poll_id: polls[1].id, value: 'Sushi'},
      {poll_id: polls[1].id, value: 'Sunflower Seeds'},
      {poll_id: polls[2].id, value: 'Orange', description: 'Clearly the winner'},
      {poll_id: polls[2].id, value: 'Blue'}
    ])
    .returning('*')
  }

  function insertVotes(options) {
    return knex('votes').insert([
      {option_id: options[0].id, user_cookie: 1, point_weight: 1},
      {option_id: options[1].id, user_cookie: 1, point_weight: 0},
      {option_id: options[0].id, user_cookie: 2, point_weight: 1},
      {option_id: options[1].id, user_cookie: 2, point_weight: 0},
      {option_id: options[2].id, user_cookie: 1, point_weight: 1},
      {option_id: options[3].id, user_cookie: 1, point_weight: 0},
      {option_id: options[2].id, user_cookie: 3, point_weight: 1},
      {option_id: options[3].id, user_cookie: 3, point_weight: 0},
      {option_id: options[4].id, user_cookie: 2, point_weight: 0},
      {option_id: options[5].id, user_cookie: 2, point_weight: 1},
      {option_id: options[4].id, user_cookie: 3, point_weight: 1},
      {option_id: options[5].id, user_cookie: 3, point_weight: 0}
    ])
    .returning('*')
  }

  return deleteVotes()
    .then(deleteOptions)
    .then(deletePolls)
    .then(deleteUsers)
    .then(insertUsers)
    .then(users => insertPolls(users))
    .then(polls => insertOptions(polls))
    .then(options => insertVotes(options))
};
