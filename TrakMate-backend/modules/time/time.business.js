// modules/time/time.business.js
import { getAllTimes, createTime } from './time.model.js';

// Logică pentru a prelua timpii
export async function listTimes() {
  const times = await getAllTimes();
  if (!times) {
    throw new Error('Times could not be retrieved from the database.');
  }
  return times;
}

// Logică pentru a adăuga un timp (poți adăuga validări mai complexe aici)
export async function addTime(timeData) {
  const { pilotId, circuitId, lapTimeMs } = timeData;

  // Validare de bază
  if (!pilotId || !circuitId || lapTimeMs == null || lapTimeMs <= 0) {
    throw new Error('Invalid data provided for time record.');
  }

  const newTime = await createTime(timeData);
  return newTime;
}