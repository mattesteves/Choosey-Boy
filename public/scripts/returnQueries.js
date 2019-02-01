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

//return value from target table
async function getValue(table, returnValue, id) {
  try {
    let row =  await knex.select(returnValue).from(table).where({id: id});
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
    return totalWeight;
  } catch(e) {
    console.log('error summing option weight');
  }
}
//return poll id

module.exports = {
  getValue: getValue,
  weightSum: weightSum
}
