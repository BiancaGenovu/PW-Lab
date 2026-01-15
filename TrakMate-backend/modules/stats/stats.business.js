const { countActiveCircuits, countTotalTimes } = require('./stats.model.js');

async function getHomepageStats() {
  const circuitsCount = await countActiveCircuits();
  const timesCount = await countTotalTimes();

  return {
    circuits: circuitsCount,
    times: timesCount
  };
}

module.exports = {
  getHomepageStats
};