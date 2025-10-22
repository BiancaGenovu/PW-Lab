const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pilot = await prisma.user.upsert({
    where: { email: 'pilot@tm.test' },
    update: {},
    create: { email: 'pilot@tm.test', name: 'Pilot Demo', password: 'hash_here', role: 'Pilot' },
  });

  const monza = await prisma.circuit.upsert({
    where: { name_country: { name: 'Monza', country: 'IT' } },
    update: {},
    create: { name: 'Monza', km: 5.793, country: 'IT' },
  });

  await prisma.time.create({ data: { pilotId: pilot.id, circuitId: monza.id, lapTimeMs: 83250 } });

  console.log('Seed OK');
}
main().finally(() => prisma.$disconnect());
