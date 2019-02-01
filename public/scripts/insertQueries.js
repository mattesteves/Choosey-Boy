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

//disconnect from db
function disconnect() {
  knex.destroy();
}

async function insertUser(email) {
  try {
    let usersEmail = await knex('users').where({email: email});
    if(usersEmail[0]) {
      await knex.destroy();
      throw 'email in database';
    }
    await knex('users').insert({email: email});
    await knex.destroy();
  } catch(e) {
    console.log('error inserting user into users table: ', e);
  }
}
insertUser('michael@gmail.com')

// inserts new poll into polls table
function insertPoll(email, value, options, descriptions, selectUser) {
  return(
    selectUser(email).then(user => {
      if(!user[0]) throw 'email not in database'
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
          .catch(err => console.log('error selecting user with input value', err))
    })
    .catch(err => console.log('error inputing user', err))
  )
}

//inserts options for new poll
function insertOptions(poll, option, description) {
  return(
    knex('options')
      .insert({
        poll_id: poll[0].id, value: option, description: description
      })
      .catch(err => console.log('error inserting option', err))
  )
}

//selects option by target value row from options table
function selectOptionByValue(value) {
  return(
    knex('options')
      .where({
        value: value
      })
      .returning('*')
      .catch(err => console.log('error selecting option', err))
  )
}

//inserts user votes into votes database
function insertVotes(optionValue, userCookie, pointWeight, selectOption) {
  return(
    selectOption(optionValue).then(option => {
      knex('votes')
        .insert({
          option_id: option[0].id,
          user_cookie: userCookie,
          point_weight: pointWeight
        })
        .catch(err => console.log('error inserting vote', err))
    })
    .catch(err => console.log('error selecting option with input value', err))
  )
}

module.exports = {
  disconnect: disconnect,
  insertPoll: insertPoll,
  insertOptions: insertOptions,
  selectOptionByValue: selectOptionByValue,
  insertVotes: insertVotes
}
