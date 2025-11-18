// modules/timePilot/timePilot.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Listă timpi pentru un pilot
 */
async function getTimesByPilotId(pilotId) {
  const targetPilotId = Number(pilotId);
  return prisma.timeRecord.findMany({
    where: { pilotId: targetPilotId },
    orderBy: { lapTimeMs: 'asc' },
    select: {
      id: true,
      lapTimeMs: true,
      createdAt: true,
      circuit: { select: { id: true, name: true, country: true, km: true } },
      pilot:   { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

/** Parsează "MM:SS.mmm" sau milisecunde numerice */
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
async function createTimeForPilot({ pilotId, circuitName, country, lapTime }) {
  const targetPilotId = Number(pilotId);
  if (!targetPilotId) throw new Error('Invalid pilotId');

  if (!circuitName || !country || lapTime == null) {
    throw new Error('circuitName, country, lapTime required');
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

  const lapTimeMs = parseLapToMs(lapTime);

  return prisma.timeRecord.create({
    data: {
      pilotId: targetPilotId,
      circuitId: circuit.id,
      lapTimeMs
    },
    select: {
      id: true,
      lapTimeMs: true,
      createdAt: true,
      pilot:   { select: { id: true, firstName: true, lastName: true } },
      circuit: { select: { id: true, name: true, country: true } }
    }
  });
}

module.exports = { 
  getTimesByPilotId,
  createTimeForPilot
};
