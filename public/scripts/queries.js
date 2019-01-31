require('dotenv').config({path: '../.env'});

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

//inserts new user into users table
function insertUser(email) {
  knex('users')
    .insert({
      email: email
    })
    .catch(err => console.log('error inputing user', err))
    .then(function () {
      knex.destroy();
    });
}

//executes callback if user exists
function checkUser(email, callback) {
  knex.select('*').from('users')
    .where({
      email: email
    })
    .then(user => {
      if(!user[0]) {

        // user not in database
        callback(email);
      } else{

        //user in database
        knex.destroy()
        throw 'user exists'
      }
    })
    .catch(err => console.log('error inputing user', err))
}

// inserts new poll into polls table
// function insertPoll(email) {
//   knex('users')
//     .insert({

//     })
//     .catch(err => console.log('error inputing user', err))
//     .then(function() {
//       knex.destroy();
//     })
// }
