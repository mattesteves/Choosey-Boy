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

//return title of target poll
async function getPollValue(pollId) {
 try {
  let selectPoll =  await knex.select('value').from('polls').where({id: pollId});
  return selectPoll[0].value;
  knex.destroy();
 } catch(e) {
  console.log('return poll value error');
 }
}

//return value from target table
async function getValue(table, returnValue, id) {
  try {
    let row =  await knex.select(returnValue).from(table).where({id: id});
    knex.destroy();
    return row[0][returnValue];
  } catch(e) {
    console.log('return poll title error');
  }
}

//return sum of points for option
async function weightSum(optionId) {
  try {
    let totalWeight = 0;
    let options = await knex('votes').where({option_id: optionId});
    options.forEach((option) => {
      totalWeight += option.point_weight;
    });
    knex.destroy();
    return totalWeight;
  } catch(e) {
    console.log('error summing option weight');
  }
}

module.exports = {
  getPollValue: getPollValue,
  getValue: getValue,
  weightSum: weightSum
}
