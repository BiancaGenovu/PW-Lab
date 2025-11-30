// modules/timePilot/timePilot.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: calculează timpul total
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

/**
 * Listă timpi pentru un pilot
 */
async function getTimesByPilotId(pilotId) {
  const targetPilotId = Number(pilotId);
  const times = await prisma.timeRecord.findMany({
    where: { pilotId: targetPilotId },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      createdAt: true,
      circuit: { select: { id: true, name: true, country: true, km: true } },
      pilot:   { select: { id: true, firstName: true, lastName: true } },
    },
  });

  // Adaugă timpul total și sortează
  return times
    .map(t => ({
      ...t,
      lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
    }))
    .sort((a, b) => a.lapTimeMs - b.lapTimeMs);
}

/** Parsează "MM:SS.mmm" sau miliseconde numerice */
function parseLapToMs(input) {
  if (typeof input === 'number') return input;
  const s = String(input).trim();
  if (/^\d+$/.test(s)) return Number(s);

  const m = s.match(/^(\d+):([0-5]?\d)\.(\d{1,3})$/);
  if (!m) throw new Error('Invalid lap time format (use ms or MM:SS.mmm)');
  const minutes = Number(m[1]);
  const seconds = Number(m[2]);
  const millis  = Number(m[3].padEnd(3, '0'));
  return minutes * 60_000 + seconds * 1_000 + millis;
}

/**
 * Creează un timp pentru un pilot cunoscut, identificând circuitul după nume+țară
 */
async function createTimeForPilot({ pilotId, circuitName, country, sector1, sector2, sector3 }) {
  const targetPilotId = Number(pilotId);
  if (!targetPilotId) throw new Error('Invalid pilotId');

  if (!circuitName || !country || sector1 == null || sector2 == null || sector3 == null) {
    throw new Error('circuitName, country, sector1, sector2, sector3 required');
  }

  const circuit = await prisma.circuit.findFirst({
    where: {
      name: { equals: String(circuitName).trim(), mode: 'insensitive' },
      country: { equals: String(country).trim(), mode: 'insensitive' },
      isActive: true
    },
    select: { id: true, name: true, country: true }
  });
  if (!circuit) throw new Error('Circuit not found');

  // Parsează timpii sectoare
  const sector1Ms = parseLapToMs(sector1);
  const sector2Ms = parseLapToMs(sector2);
  const sector3Ms = parseLapToMs(sector3);

  const created = await prisma.timeRecord.create({
    data: {
      pilotId: targetPilotId,
      circuitId: circuit.id,
      sector1Ms,
      sector2Ms,
      sector3Ms
    },
    select: {
      id: true,
      sector1Ms: true,
      sector2Ms: true,
      sector3Ms: true,
      createdAt: true,
      pilot:   { select: { id: true, firstName: true, lastName: true } },
      circuit: { select: { id: true, name: true, country: true } }
    }
  });

  // Adaugă timpul total calculat
  return {
    ...created,
    lapTimeMs: calculateTotalTime(created.sector1Ms, created.sector2Ms, created.sector3Ms)
  };
}

module.exports = { 
  getTimesByPilotId,
  createTimeForPilot
};