// modules/comparare-top3/comparare-top3.controler.js
const { analyzeTop3Position } = require('./comparare-top3.business.js');

/**
 * GET /api/comparare-top3/:pilotId/:circuitId
 */
async function compareTop3Controler(req, res) {
  try {
    const { pilotId, circuitId } = req.params;

    if (!pilotId || !circuitId) {
      return res.status(400).json({ 
        error: 'pilotId and circuitId are required' 
      });
    }

    const result = await analyzeTop3Position(pilotId, circuitId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in compareTop3Controler:', err);
    res.status(500).json({ 
      error: 'Failed to compare with top 3',
      detail: err.message 
    });
  }
}

module.exports = {
  compareTop3Controler
};