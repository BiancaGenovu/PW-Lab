// modules/time/time.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTimes() {
  return prisma.timeRecord.findMany({
    orderBy: { lapTimeMs: 'asc' },
    select: {
      id: true,
      lapTimeMs: true,
      createdAt: true,
      pilot:   { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      circuit: { select: { id: true, name: true, country: true, km: true } },
    },
  });
}

async function getTimesByCircuitId(circuitId) {
  const targetCircuitId = Number(circuitId);   // NU mai suprascrie cu 1
  return prisma.timeRecord.findMany({
    where: { circuitId: targetCircuitId },
    orderBy: { lapTimeMs: 'asc' },
    select: {
      id: true,
      lapTimeMs: true,
      createdAt: true,
      pilot:   { select: { id: true, firstName: true, lastName: true } },
      circuit: { select: { id: true, name: true, country: true } },
    },
  });
}

module.exports = { getAllTimes, getTimesByCircuitId };