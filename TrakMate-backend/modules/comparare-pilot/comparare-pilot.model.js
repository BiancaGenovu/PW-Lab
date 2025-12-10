// modules/comparare-pilot/comparare-pilot.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: calculează timpul total
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

/**
 * Ia cel mai bun timp al unui pilot pe un circuit
 */
async function getBestTimeForPilot(pilotId, circuitId) {
  const targetPilotId = Number(pilotId);
  const targetCircuitId = Number(circuitId);

  if (!targetPilotId || !targetCircuitId) {
    throw new Error('Invalid pilotId or circuitId');
  }

  const times = await prisma.timeRecord.findMany({
    where: {
      pilotId: targetPilotId,
      circuitId: targetCircuitId
    },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      createdAt: true,
      pilot: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      circuit: { select: { id: true, name: true, country: true } }
    }
  });

  if (!times || times.length === 0) {
    return null;
  }

  // Calculează timpul total pentru fiecare
  const timesWithTotal = times.map(t => ({
    ...t,
    lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
  }));

  // Găsește cel mai bun timp
  return timesWithTotal.reduce((best, current) => 
    current.lapTimeMs < best.lapTimeMs ? current : best
  );
}

module.exports = {
  getBestTimeForPilot
};