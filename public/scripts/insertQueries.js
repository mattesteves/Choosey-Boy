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
//adds user to database if email does not exist in users table
async function insertUser(email) {
  try {
    let usersEmail = await knex('users').where({email: email});
    if(usersEmail[0]) {
      throw 'email in database';
    }
    await knex('users').insert({email: email});
  } catch(e) {
    console.log('error inserting user into users table: ', e);
  }
}

// inserts new poll into polls table and calls insert option function for each option
async function insertPoll(email, value, options, descriptions, insertData) {
  try{
    let user = await knex.select('id').from('users').where({email: email});
    let userId = user[0].id;
    let newPollId = await knex('polls').insert({user_id: userId, value: value}).returning('id');

    //add each option in array
    await options.forEach((option, i) => {
      insertData(newPollId[0], option, descriptions[i]);
    });


    return newPollId;
  } catch (e) {
    console.log('error inserting poll into polls table: ', e);
  }
}

// let pollId = insertPoll('mike@gmail.com', 'polllll', ['first option', 'second option'], ['',''], insertOptions)

//inserts options for new poll
async function insertOptions(pollId, option, description){
  try {
    await knex('options').insert({poll_id: pollId, value: option, description: description});
  } catch (e) {
    console.log('error inserting option into options table: ', e);
  }
}

//inserts user votes into votes database
async function insertVotes(optionValue, userCookie, pointWeight) {
  try {
    let optionId = await knex.select('id').from('options').where({value: optionValue});
    await knex('votes').insert({option_id: optionId[0].id, user_cookie: userCookie, point_weight: pointWeight});

  }catch (e) {
    console.log('error inserting vote into votes table: ', e);
  }
}

module.exports = {
  insertUser: insertUser,
  insertPoll: insertPoll,
  insertOptions: insertOptions,
  insertVotes: insertVotes
}
