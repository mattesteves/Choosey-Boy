require('dotenv').config({path: '../../.env'});

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    port     : process.env.DB_PORT,
    ssl      : process.env.DB_SSL
  }
})

// select user through email
function selectUserByEmail(email){
  return(
    knex.select('id').from('users')
      .where({
        email: email
      })
      .returning('*')
  )
}

//inserts new user into users table
function insertUser(email, selectUser) {
  selectUser(email).then(user => {
    if(!user[0]){
      knex('users')
        .insert({
          email: email
        })
        .catch(err => console.log('error inputing user', err))
    } else{
      console.log('user in database')
    }
  })
}

// inserts new poll into polls table
function insertPoll(email, value, selectUser) {
  selectUser(email).then(user => {
      knex('polls')
        .insert({
          user_id: user[0].id, value: value
        })
        .catch(err => console.log('error inputing user', err))
        .then(function() {
          knex.destroy();
        })
  })
}
// insertPoll('mike@gmail.com', 'new poll', selectUserByEmail)
insertUser('mikesnow@gmail.com', selectUserByEmail);

