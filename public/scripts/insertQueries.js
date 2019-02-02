module.exports = function insertQueries(knex) {
  return {

    //adds user to database if email does not exist in users table
    insertUser: async function (email) {
      try {
        let usersEmail = await knex('users').where({email: email});
        if(usersEmail[0]) {
          throw 'email in database';
        }
        await knex('users').insert({email: email});
      } catch(e) {
        console.log('error inserting user into users table: ', e);
      }
    },

    // inserts new poll into polls table and calls insert option function for each option
    insertPoll: async function (email, value, options, descriptions, insertData) {
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
    },

    // let pollId = insertPoll('mike@gmail.com', 'polllll', ['first option', 'second option'], ['',''], insertOptions)

    //inserts options for new poll
    insertOptions: async function(pollId, option, description) {
      try {
        await knex('options').insert({poll_id: pollId, value: option, description: description});
      } catch (e) {
        console.log('error inserting option into options table: ', e);
      }
    },

    //inserts user votes into votes database
    insertVotes: async function(pollId, optionValue, userCookie, pointWeight) {
      try {
        let optionId = await knex.select('id').from('options').where({value: optionValue}).andWhere({poll_id: pollId});
        await knex('votes').insert({option_id: optionId[0].id, user_cookie: userCookie, point_weight: pointWeight});

      }catch (e) {
        console.log('error inserting vote into votes table: ', e);
      }
    }

  }
}
