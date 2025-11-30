// modules/evolutiaMea/evolutiaMea.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: calculează timpul total
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

/**
 * Ia toți timpii unui pilot pe un circuit specific
 */
async function getMyTimesOnCircuit(pilotId, circuitId) {
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
      pilot: { select: { id: true, firstName: true, lastName: true } },
      circuit: { select: { id: true, name: true, country: true } }
    },
    orderBy: { createdAt: 'asc' } // cronologic
  });

  // Calculează timpul total pentru fiecare
  return times.map(t => ({
    ...t,
    lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
  }));
}

module.exports = {
  getMyTimesOnCircuit
};