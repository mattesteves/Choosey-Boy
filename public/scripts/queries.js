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
function insertPoll(email, value, options, descriptions, selectUser) {
  selectUser(email).then(user => {
      knex('polls')
        .insert({
          user_id: user[0].id, value: value
        })
        .returning('*')

        //add inputed options to the poll
        .then(poll => {
          options.forEach((option, i) => {
            insertOptions(poll, option, descriptions[i])
          })
        })
        .catch(err => console.log('error inserting poll', err))
  })
}

//inserts options for new poll
function insertOptions(poll, option, description) {
  console.log(poll, description)
  knex('options')
    .insert({
      poll_id: poll[0].id, value: option, description: description
    })
    .catch(err => console.log('error inserting option', err))
}

//selects option by target value row from options table
function selectOptionByValue(value) {
  return(
    knex('options')
      .where({
        value: value
      })
      .returning('*')
  )
}

//inserts user votes into votes database
function insertVotes(optionValue, userCookie, pointWeight, selectOption) {
  selectOption(optionValue).then(option => {
    knex('votes')
      .insert({
        option_id: option[0].id,
        user_cookie: userCookie,
        point_weight: pointWeight
      })
      .catch(err => console.log('error inserting vote', err))
  })
}

// insertVotes('Airplane', 12, 5, selectOptionByValue);
// insertPoll('mike@gmail.com', 'poll1', ['option1', 'option2', 'option3'], ['desc1'], selectUserByEmail)
// insertUser('mikesnow@gmail.com', selectUserByEmail);

module.exports = {
  selectUserByEmail: selectUserByEmail,
  insertUser: insertUser,
  insertPoll: insertPoll,
  insertOptions: insertOptions,
  selectOptionByValue: selectOptionByValue,
  insertVotes: insertVotes
}
