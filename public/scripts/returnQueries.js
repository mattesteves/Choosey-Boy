module.exports = function returnQueries(knex) {
  return {

    //return value from target table
    getValue: async function(table, returnValue, id) {
      try {
        let row =  await knex.select(returnValue).from(table).where({id: id});
        return row[0][returnValue];
      } catch(e) {
        console.log('return poll title error');
      }
    },

    //return sum of points for option
    weightSum: async function(optionId) {
      try {
        let totalWeight = 0;
        let options = await knex('votes').where({option_id: optionId});
        options.forEach((option) => {
          totalWeight += option.point_weight;
        });
        return totalWeight;
      } catch(e) {
        console.log('error summing option weight');
      }
    },

    //returns an object of each option with value, total points, id and description
    optionWeights: async function(pollId, getOptions, getOptionId, weightSum, getValue) {
      try {
        let totalPoints = 0;
        let optionTotalPoints = {};

        let options = await getOptions(pollId);

        for(let option of options) {
            let id = await getOptionId(pollId, option.value);
            let description = await getValue('options', 'description', id);
            let pointSum = await weightSum(id);
            totalPoints += pointSum;
            optionTotalPoints[option.value] = {
              id: id,
              points: pointSum,
              description: description
            }
          }
        return optionTotalPoints;
      } catch(e) {
        console.log('error calculating percentage');
      }
    },

    //checks if userid cookie is in voted database
    checkCookie: async function(cookie, pollId) {
      try {
        let user = await knex.select('user_cookie').from('votes').innerJoin('options', {'option_id':'options.id'}).where({user_cookie: cookie}).andWhere({poll_id: pollId});
        return user;
      } catch(e) {
        console.log('error checking userid cookie');
      }
    },

    //given a poll id and option value, returns option's id
    getPollIdFromEmail: async function(email) {
     try{
       let poll = await knex.select('polls.id', 'polls.value').from('users').innerJoin('polls', {'users.id':'user_id'}).where({'users.email': email});
       return poll;
     } catch(e) {
       console.log('error getting poll id givin email');
     }
   },

    getOptionId: async function(pollId, value) {
      try {
        let options = await knex.select('*').from('options');
        .where({poll_id: pollId})
        .andWhere({value: value});
        return options[0].id;
      } catch(e) {
        console.log('error getting option id');
      }
    },

    //return options of givin id
    getOptions: async function(pollId) {
      try{
        let options = await knex('options').where({poll_id: pollId});
        let optionValues = [];
        options.forEach((option) => {
          optionValues.push({value: option.value, description: option.description});
        })
        return optionValues;
      } catch(e) {
        console.log('error getting options for id');
      }
    },

    //returns poll creator's email given poll id
    getEmailFromPollId: async function(pollId) {
      try{
        let user = await knex.select('email').from('users').innerJoin('polls', {'users.id':'user_id'}).where({'polls.id': pollId});
        return user[0].email;
      } catch(e) {
        console.log('error getting user email givin poll id');
      }
    }

  }
}




