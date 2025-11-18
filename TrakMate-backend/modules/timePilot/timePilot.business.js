// modules/timePilot/timePilot.business.js
const { getTimesByPilotId, createTimeForPilot } = require('./timePilot.model.js');

async function listPilotTimes(pilotId) {
  if (!pilotId) throw new Error('Pilot ID is required.');
  return getTimesByPilotId(pilotId);
}

async function addPilotTime(pilotId, payload) {
  // payload: { circuitName, country, lapTime }
  return createTimeForPilot({ pilotId, ...payload });
}

module.exports = {
  listPilotTimes,
  addPilotTime
};
