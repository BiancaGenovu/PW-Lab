// modules/comparare-top3/comparare-top3.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: calculează timpul total
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

/**
 * Ia top 3 cei mai rapizi piloți pe un circuit
 */
async function getTop3OnCircuit(circuitId) {
  const targetCircuitId = Number(circuitId);

  if (!targetCircuitId) {
    throw new Error('Invalid circuitId');
  }

  // Ia toate timpurile de pe circuit
  const allTimes = await prisma.timeRecord.findMany({
    where: {
      circuitId: targetCircuitId
    },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      createdAt: true,
      pilotId: true,
      pilot: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      circuit: { select: { id: true, name: true, country: true } }
    }
  });

  if (!allTimes || allTimes.length === 0) {
    return [];
  }

  // Calculează timpul total pentru fiecare
  const timesWithTotal = allTimes.map(t => ({
    ...t,
    lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
  }));

  // Grupează pe pilot și ia cel mai bun timp pentru fiecare
  const bestTimesByPilot = {};
  timesWithTotal.forEach(time => {
    const pilotId = time.pilotId;
    if (!bestTimesByPilot[pilotId] || time.lapTimeMs < bestTimesByPilot[pilotId].lapTimeMs) {
      bestTimesByPilot[pilotId] = time;
    }
  });

  // Convertește în array și sortează
  const bestTimes = Object.values(bestTimesByPilot);
  bestTimes.sort((a, b) => a.lapTimeMs - b.lapTimeMs);

  // Ia doar top 3
  return bestTimes.slice(0, 3);
}

/**
 * Ia poziția unui pilot pe circuit
 */
async function getMyPositionOnCircuit(pilotId, circuitId) {
  const targetPilotId = Number(pilotId);
  const targetCircuitId = Number(circuitId);

  if (!targetPilotId || !targetCircuitId) {
    throw new Error('Invalid pilotId or circuitId');
  }

  // Ia toate timpurile de pe circuit
  const allTimes = await prisma.timeRecord.findMany({
    where: {
      circuitId: targetCircuitId
    },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      pilotId: true,
      pilot: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
    }
  });

  if (!allTimes || allTimes.length === 0) {
    return null;
  }

  // Calculează timpul total pentru fiecare
  const timesWithTotal = allTimes.map(t => ({
    ...t,
    lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
  }));

  // Grupează pe pilot și ia cel mai bun timp pentru fiecare
  const bestTimesByPilot = {};
  timesWithTotal.forEach(time => {
    const pid = time.pilotId;
    if (!bestTimesByPilot[pid] || time.lapTimeMs < bestTimesByPilot[pid].lapTimeMs) {
      bestTimesByPilot[pid] = time;
    }
  });

  // Convertește în array și sortează
  const bestTimes = Object.values(bestTimesByPilot);
  bestTimes.sort((a, b) => a.lapTimeMs - b.lapTimeMs);

  // Găsește poziția pilotului
  const myPosition = bestTimes.findIndex(t => t.pilotId === targetPilotId);
  
  if (myPosition === -1) {
    return null; // Pilotul nu are timpi pe acest circuit
  }

  return {
    position: myPosition + 1,
    time: bestTimes[myPosition],
    totalPilots: bestTimes.length
  };
}

module.exports = {
  getTop3OnCircuit,
  getMyPositionOnCircuit
};