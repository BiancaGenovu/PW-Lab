import { getPilot } from './pilot.model.js';

export async function circuitDetails() {
  const pilotRows = await getPilot();
  if (!pilotRows) {
    throw new Error('pilots can not be get');
  }
  return pilotRows;
}
