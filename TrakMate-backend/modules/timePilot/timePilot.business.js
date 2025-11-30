// modules/timePilot/timePilot.business.js
const { getTimesByPilotId, createTimeForPilot } = require('./timePilot.model.js');

async function listPilotTimes(pilotId) {
  if (!pilotId) throw new Error('Pilot ID is required.');
  return getTimesByPilotId(pilotId);
}

async function addPilotTime(pilotId, payload) {
  // payload: { circuitName, country, sector1, sector2, sector3 }
  return createTimeForPilot({ pilotId, ...payload });
}

module.exports = {
  listPilotTimes,
  addPilotTime
}; 