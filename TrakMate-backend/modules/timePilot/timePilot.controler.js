// modules/timePilot/timePilot.controller.js
const { listPilotTimes, addPilotTime } = require('./timePilot.business.js');

async function getPilotTimesController(req, res) {
  try {
    const { pilotId } = req.params;
    if (!pilotId) return res.status(400).json({ message: 'Pilot ID is required in URL.' });

    const times = await listPilotTimes(pilotId);
    res.status(200).json(times);
  } catch (err) {
    console.error('Failed to load specific pilot times', err);
    const status = err.message.includes('required') ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
}

/** POST /api/timePilot/:pilotId/times  body: { circuitName, country, lapTime } */
async function createPilotTimeController(req, res) {
  try {
    const { pilotId } = req.params;
    const { circuitName, country, lapTime } = req.body;

    if (!pilotId) return res.status(400).json({ message: 'Pilot ID is required in URL.' });
    if (!circuitName || !country || lapTime == null) {
      return res.status(400).json({ message: 'circuitName, country, lapTime required' });
    }

    const created = await addPilotTime(pilotId, { circuitName, country, lapTime });
    res.status(201).json(created);
  } catch (err) {
    console.error('Failed to create pilot time', err);
    const status = /not found|invalid|required/i.test(err.message) ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
}

module.exports = {
  getPilotTimesController,
  createPilotTimeController
};
