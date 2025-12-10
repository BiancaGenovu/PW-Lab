// modules/comparare-pilot/comparare-pilot.controler.js
const { comparePilots } = require('./comparare-pilot.business.js');

/**
 * GET /api/comparare-pilot/:myPilotId/:rivalPilotId/:circuitId
 */
async function comparePilotsControler(req, res) {
  try {
    const { myPilotId, rivalPilotId, circuitId } = req.params;

    if (!myPilotId || !rivalPilotId || !circuitId) {
      return res.status(400).json({ 
        error: 'myPilotId, rivalPilotId and circuitId are required' 
      });
    }

    const result = await comparePilots(myPilotId, rivalPilotId, circuitId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in comparePilotsControler:', err);
    res.status(500).json({ 
      error: 'Failed to compare pilots',
      detail: err.message 
    });
  }
}

module.exports = {
  comparePilotsControler
};