const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Numără circuitele active
async function countActiveCircuits() {
  return await prisma.circuit.count({
    where: { isActive: true }
  });
}

// Numără toți timpii înregistrați
async function countTotalTimes() {
  return await prisma.timeRecord.count();
}

module.exports = {
  countActiveCircuits,
  countTotalTimes
};