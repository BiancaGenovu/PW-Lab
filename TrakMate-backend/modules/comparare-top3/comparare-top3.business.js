// modules/comparare-top3/comparare-top3.business.js
const { getTop3OnCircuit, getMyPositionOnCircuit } = require('./comparare-top3.model.js');

/**
 * Analizează poziția ta față de top 3
 */
async function analyzeTop3Position(pilotId, circuitId) {
  if (!pilotId || !circuitId) {
    throw new Error('pilotId and circuitId are required');
  }

  // Ia top 3
  const top3 = await getTop3OnCircuit(circuitId);

  if (!top3 || top3.length === 0) {
    return {
      top3: [],
      myPosition: null,
      gapAnalysis: null,
      message: 'Nu există timpi pe acest circuit'
    };
  }

  // Ia poziția ta
  const myPosition = await getMyPositionOnCircuit(pilotId, circuitId);

  if (!myPosition) {
    return {
      top3,
      myPosition: null,
      gapAnalysis: null,
      message: 'Nu ai timpi pe acest circuit'
    };
  }

  const leader = top3[0];
  const myTime = myPosition.time;

  // Calculează diferențele față de lider
  const timeDiff = myTime.lapTimeMs - leader.lapTimeMs;
  
  const gapAnalysis = {
    timeDiff,
    sector1Diff: myTime.sector1Ms - leader.sector1Ms,
    sector2Diff: myTime.sector2Ms - leader.sector2Ms,
    sector3Diff: myTime.sector3Ms - leader.sector3Ms,
    percentageGap: ((timeDiff / leader.lapTimeMs) * 100).toFixed(2),
    closenessPercentage: (100 - ((timeDiff / leader.lapTimeMs) * 100)).toFixed(2)
  };

  return {
    top3,
    myPosition,
    gapAnalysis,
    circuit: leader.circuit
  };
}

module.exports = {
  analyzeTop3Position
};