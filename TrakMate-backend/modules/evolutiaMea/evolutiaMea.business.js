// modules/evolutiaMea/evolutiaMea.business.js
const { getMyTimesOnCircuit } = require('./evolutiaMea.model.js');

/**
 * Logică pentru analiza evoluției personale
 */
async function analyzeMyEvolution(pilotId, circuitId) {
  if (!pilotId || !circuitId) {
    throw new Error('pilotId and circuitId are required');
  }

  const times = await getMyTimesOnCircuit(pilotId, circuitId);

  if (!times || times.length === 0) {
    return {
      times: [],
      stats: null,
      message: 'Nu ai timpi înregistrați pe acest circuit'
    };
  }

  // Calculează statistici
  const lapTimes = times.map(t => t.lapTimeMs);
  const bestTime = Math.min(...lapTimes);
  const worstTime = Math.max(...lapTimes);
  const avgTime = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
  
  const lastTime = times[times.length - 1];
  const bestTimeRecord = times.find(t => t.lapTimeMs === bestTime);

  // Consistency: cât de aproape ești de best time în medie
  const consistency = ((bestTime / avgTime) * 100).toFixed(2);

  // Îmbunătățire: diferența dintre primul și ultimul timp
  const firstTime = times[0].lapTimeMs;
  const improvement = firstTime - lastTime.lapTimeMs;

  // Comparație ultimul vs best pe sectoare
  const sectorComparison = {
    sector1: {
      last: lastTime.sector1Ms,
      best: bestTimeRecord.sector1Ms,
      diff: lastTime.sector1Ms - bestTimeRecord.sector1Ms
    },
    sector2: {
      last: lastTime.sector2Ms,
      best: bestTimeRecord.sector2Ms,
      diff: lastTime.sector2Ms - bestTimeRecord.sector2Ms
    },
    sector3: {
      last: lastTime.sector3Ms,
      best: bestTimeRecord.sector3Ms,
      diff: lastTime.sector3Ms - bestTimeRecord.sector3Ms
    }
  };

  return {
    times, // toate timpiile pentru grafic
    stats: {
      totalRuns: times.length,
      bestTime,
      worstTime,
      avgTime,
      lastTime: lastTime.lapTimeMs,
      consistency: parseFloat(consistency),
      improvement,
      sectorComparison
    },
    pilot: lastTime.pilot,
    circuit: lastTime.circuit
  };
}

module.exports = {
  analyzeMyEvolution
};