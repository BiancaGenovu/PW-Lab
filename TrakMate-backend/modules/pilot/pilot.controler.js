import { pilotDetails } from './pilot.business.js';

export async function getPilotController(req, res) {
  try {
    const pilot = await pilotDetails();
    res.status(200).json(pilot);
  } catch (err) {
    console.error('Pilot can not be taken', err);
    res.status(500).json({ message: 'Failed to load pilot' });
  }
}
