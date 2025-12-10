// modules/comparare-pilot/comparare-pilot.business.js
const { getBestTimeForPilot } = require('./comparare-pilot.model.js');

/**
 * Compară doi piloți pe un circuit
 */
async function comparePilots(myPilotId, rivalPilotId, circuitId) {
  if (!myPilotId || !rivalPilotId || !circuitId) {
    throw new Error('myPilotId, rivalPilotId and circuitId are required');
  }

  // Ia cel mai bun timp pentru ambii piloți
  const myBest = await getBestTimeForPilot(myPilotId, circuitId);
  const rivalBest = await getBestTimeForPilot(rivalPilotId, circuitId);

  // Verifică dacă ambii au timpi
  if (!myBest && !rivalBest) {
    return {
      myTime: null,
      rivalTime: null,
      comparison: null,
      message: 'Niciunul dintre piloți nu are timpi pe acest circuit'
    };
  }

  if (!myBest) {
    return {
      myTime: null,
      rivalTime: rivalBest,
      comparison: null,
      message: 'Nu ai timpi pe acest circuit'
    };
  }

  if (!rivalBest) {
    return {
      myTime: myBest,
      rivalTime: null,
      comparison: null,
      message: 'Pilotul rival nu are timpi pe acest circuit'
    };
  }

  // Calculează diferențe
  const timeDiff = myBest.lapTimeMs - rivalBest.lapTimeMs;
  const winner = timeDiff < 0 ? 'you' : (timeDiff > 0 ? 'rival' : 'tie');

  // Comparație pe sectoare
  const sectorComparison = {
    sector1: {
      you: myBest.sector1Ms,
      rival: rivalBest.sector1Ms,
      diff: myBest.sector1Ms - rivalBest.sector1Ms,
      winner: myBest.sector1Ms < rivalBest.sector1Ms ? 'you' : (myBest.sector1Ms > rivalBest.sector1Ms ? 'rival' : 'tie')
    },
    sector2: {
      you: myBest.sector2Ms,
      rival: rivalBest.sector2Ms,
      diff: myBest.sector2Ms - rivalBest.sector2Ms,
      winner: myBest.sector2Ms < rivalBest.sector2Ms ? 'you' : (myBest.sector2Ms > rivalBest.sector2Ms ? 'rival' : 'tie')
    },
    sector3: {
      you: myBest.sector3Ms,
      rival: rivalBest.sector3Ms,
      diff: myBest.sector3Ms - rivalBest.sector3Ms,
      winner: myBest.sector3Ms < rivalBest.sector3Ms ? 'you' : (myBest.sector3Ms > rivalBest.sector3Ms ? 'rival' : 'tie')
    }
  };

  // Insights
  const yourStrongSector = Object.entries(sectorComparison)
    .filter(([_, data]) => data.winner === 'you')
    .sort((a, b) => Math.abs(b[1].diff) - Math.abs(a[1].diff))[0];

  const yourWeakSector = Object.entries(sectorComparison)
    .filter(([_, data]) => data.winner === 'rival')
    .sort((a, b) => Math.abs(b[1].diff) - Math.abs(a[1].diff))[0];

  const rivalWeakSector = Object.entries(sectorComparison)
    .filter(([_, data]) => data.winner === 'you')
    .sort((a, b) => Math.abs(b[1].diff) - Math.abs(a[1].diff))[0];

  return {
    myTime: myBest,
    rivalTime: rivalBest,
    comparison: {
      winner,
      timeDiff,
      sectorComparison,
      insights: {
        yourStrongSector: yourStrongSector ? yourStrongSector[0] : null,
        yourWeakSector: yourWeakSector ? yourWeakSector[0] : null,
        rivalWeakSector: rivalWeakSector ? rivalWeakSector[0] : null
      }
    }
  };
}

module.exports = {
  comparePilots
};