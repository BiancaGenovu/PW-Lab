// modules/time/time.controller.js
import { getAllTimes, getTimesByCircuitId } from './time.model.js'; 
// Asigură-te că importezi și funcția pentru creare (dacă există)

/**
 * Controller pentru GET /api/time
 */
export async function getTimesController(_req, res) {
  try {
    const times = await getAllTimes();
    res.status(200).json(times);
  } catch (err) {
    console.error('Failed to load all times', err);
    res.status(500).json({ message: 'Failed to load all times' });
  }
}

/**
 * Controller pentru POST /api/time (Exemplu)
 */
export async function createTimeController(req, res) {
  // Logica pentru adăugarea unui nou timp
  // ...
  res.status(501).json({ message: 'Not Implemented Yet' });
}


/**
 * Controller pentru GET /api/time/circuit/:circuitId
 */
export async function getCircuitTimesController(req, res) {
  try {
    const { circuitId } = req.params;
    
    if (!circuitId) {
      return res.status(400).json({ message: 'Circuit ID is required' });
    }

    const times = await getTimesByCircuitId(circuitId);
    res.status(200).json(times);
  } catch (err) {
    console.error('Failed to load specific circuit times', err);
    res.status(500).json({ message: 'Failed to load specific circuit times' });
  }
}