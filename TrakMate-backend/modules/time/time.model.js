// modules/timePilot/timePilot.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: calculează timpul total
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

async function getTimesByPilotId(pilotId) {
  const id = Number(pilotId);
  if (!id) {
    throw new Error('Invalid pilot ID');
  }

  const times = await prisma.timeRecord.findMany({
    where: { pilotId: id },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      createdAt: true,
      pilot: { select: { id: true, firstName: true, lastName: true } },
      circuit: { select: { id: true, name: true, country: true } }
    }
  });

  // Adaugă timpul total calculat și sortează
  return times
    .map(t => ({
      ...t,
      lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
    }))
    .sort((a, b) => a.lapTimeMs - b.lapTimeMs);
}

module.exports = {
  getTimesByPilotId
};