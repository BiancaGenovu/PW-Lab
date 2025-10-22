import { circuitDetails } from './circuites.business.js';

export async function getCircuitesController(req, res) {
  try {
    const circuites = await circuitDetails();
    res.status(200).json(circuites);
  } catch (err) {
    console.error('Circuites can not be taken', err);
    res.status(500).json({ message: 'Failed to load circuites' });
  }
}
