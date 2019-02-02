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

    checkCookie: async function(cookie, pollId) {
      try {
        let user = await knex.select('user_cookie').from('votes').innerJoin('options', {'option_id':'options.id'}).where({user_cookie: cookie}).andWhere({poll_id: pollId});
        return user;
      } catch(e) {
        console.log('error checking userid cookie');
      }
    },

    getOptionId: async function(pollId, value) {
      try {
        let options = await knex.select('*').from('options')
        .where({poll_id: pollId})
        .andWhere({value: value});
        return options[0].id;
      } catch(e) {
        console.log('error getting option id')
      }
    },

    //return options of givin id
    getOptions: async function(pollId) {
      try{
        let options = await knex('options').where({poll_id: pollId});
        let optionValues = [];
        options.forEach((option) => {
          optionValues.push(option.value);
        })
        return optionValues;
      } catch(e) {
        console.log('error getting options for id');
      }
    }

  }
}




