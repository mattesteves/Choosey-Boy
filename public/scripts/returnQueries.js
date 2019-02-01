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
    }

  }
}
