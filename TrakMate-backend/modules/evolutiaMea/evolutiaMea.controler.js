// modules/evolutiaMea/evolutiaMea.controler.js
const { analyzeMyEvolution } = require('./evolutiaMea.business.js');

/**
 * GET /api/evolutia-mea/:pilotId/:circuitId
 */
async function getEvolutionControler(req, res) {
  try {
    const { pilotId, circuitId } = req.params;

    if (!pilotId || !circuitId) {
      return res.status(400).json({ 
        error: 'pilotId and circuitId are required' 
      });
    }

    const result = await analyzeMyEvolution(pilotId, circuitId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in getEvolutionControler:', err);
    res.status(500).json({ 
      error: 'Failed to analyze evolution',
      detail: err.message 
    });
  }
}

module.exports = {
  getEvolutionControler
};