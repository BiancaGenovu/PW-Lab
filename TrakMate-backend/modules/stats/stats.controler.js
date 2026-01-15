const statsBusiness = require('./stats.business.js');

async function getStats(req, res) {
  try {
    const stats = await statsBusiness.getHomepageStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch homepage stats' });
  }
}

module.exports = {
  getStats
};