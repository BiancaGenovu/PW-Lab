// index.js — TrakMate backend (Node.js + Express + Prisma)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importă funcțiile de model necesare din module
const { getTimesByPilotId } = require('./modules/timePilot/timePilot.model.js');
// IMPORT NOU: routerul de auth
const authRouter = require('./modules/auth/auth.routes.js');

const app = express();
const prisma = new PrismaClient();

// ===== middleware
app.use(cors());
app.use(express.json());

// ===== healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// ===== AUTH (login/register) – montăm routerul /api/auth
app.use('/api/auth', authRouter);

// ===== USERS (pilots/admins)

// GET /api/pilot -> listă utilizatori
app.get('/api/pilot', async (_req, res) => {
  try {
    const users = await prisma.appUser.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/pilot -> creează utilizator (NOTE: pune HASH în producție sau folosește /api/auth/register)
app.post('/api/pilot', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role = 'Pilot' } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'email, password, firstName, lastName required' });
    }
    const created = await prisma.appUser.create({
      data: { email, firstName, lastName, password, role }
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// ===== CIRCUITE

// GET /api/circuites -> lista circuitelor active
app.get('/api/circuites', async (_req, res) => {
  try {
    const circuites = await prisma.circuit.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(circuites);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/circuites -> adaugă circuit
app.post('/api/circuites', async (req, res) => {
  try {
    const { name, km, country } = req.body;
    if (!name || km == null || !country) {
      return res.status(400).json({ error: 'name, km, country required' });
    }
    const created = await prisma.circuit.create({
      data: { name, km: Number(km), country }
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// ===== TIMES (laps)

// GET /api/timePilot/:pilotId -> toți timpii pentru un pilot anume
app.get('/api/timePilot/:pilotId', async (req, res) => {
  try {
    const { pilotId } = req.params;
    if (!pilotId) {
      return res.status(400).json({ error: 'Pilot ID is required' });
    }
    const times = await getTimesByPilotId(pilotId);
    res.json(times);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// util: parsează "MM:SS.mmm" sau milisecunde numerice
function parseLapToMs(input) {
  if (typeof input === 'number') return input;
  const s = String(input).trim();
  if (/^\d+$/.test(s)) return Number(s); // doar ms

  // MM:SS.mmm (sau M:SS.mmm)
  const m = s.match(/^(\d+):([0-5]?\d)\.(\d{1,3})$/);
  if (!m) throw new Error('Invalid lap time format (use ms or MM:SS.mmm)');
  const minutes = Number(m[1]);
  const seconds = Number(m[2]);
  const millis  = Number(m[3].padEnd(3, '0'));
  return minutes * 60_000 + seconds * 1_000 + millis;
}

// GET /api/circuites/:circuitId/times -> toți timpii pentru un circuit
app.get('/api/circuites/:circuitId/times', async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    if (!circuitId) return res.status(400).json({ error: 'Invalid circuitId' });

    const times = await prisma.timeRecord.findMany({
      where: { circuitId },
      select: {
        id: true,
        lapTimeMs: true,
        createdAt: true,
        pilot:   { select: { id: true, firstName: true, lastName: true } },
        circuit: { select: { id: true, name: true } }
      },
      orderBy: { lapTimeMs: 'asc' }
    });

    res.json(times);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/circuites/:circuitId/times -> adaugă timp după numele pilotului
app.post('/api/circuites/:circuitId/times', async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const { firstName, lastName, lapTime } = req.body;

    if (!circuitId) return res.status(400).json({ error: 'Invalid circuitId' });
    if (!firstName || !lastName || lapTime == null) {
      return res.status(400).json({ error: 'firstName, lastName, lapTime required' });
    }

    const pilot = await prisma.appUser.findFirst({
      where: {
        firstName: { equals: String(firstName).trim(), mode: 'insensitive' },
        lastName:  { equals: String(lastName).trim(),  mode: 'insensitive' },
        role: 'Pilot',
        isActive: true
      },
      select: { id: true, firstName: true, lastName: true }
    });
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const lapTimeMs = parseLapToMs(lapTime);

    const created = await prisma.timeRecord.create({
      data: { pilotId: pilot.id, circuitId, lapTimeMs },
      select: {
        id: true,
        lapTimeMs: true,
        createdAt: true,
        pilot:   { select: { id: true, firstName: true, lastName: true } },
        circuit: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/timePilot/:pilotId/times -> adaugă timp pentru un pilot (circuit după nume+țară)
app.post('/api/timePilot/:pilotId/times', async (req, res) => {
  try {
    const pilotId = Number(req.params.pilotId);
    const { circuitName, country, lapTime } = req.body;

    if (!pilotId) return res.status(400).json({ message: 'Invalid pilotId' });
    if (!circuitName || !country || lapTime == null) {
      return res.status(400).json({ message: 'circuitName, country, lapTime required' });
    }

    // caută circuitul după nume + țară (case-insensitive, doar active)
    const circuit = await prisma.circuit.findFirst({
      where: {
        name:    { equals: String(circuitName).trim(), mode: 'insensitive' },
        country: { equals: String(country).trim(),     mode: 'insensitive' },
        isActive: true
      },
      select: { id: true, name: true, country: true }
    });
    if (!circuit) return res.status(400).json({ message: 'Circuit not found' });

    const lapTimeMs = parseLapToMs(lapTime);

    const created = await prisma.timeRecord.create({
      data: { pilotId, circuitId: circuit.id, lapTimeMs },
      select: {
        id: true,
        lapTimeMs: true,
        createdAt: true,
        pilot:   { select: { id: true, firstName: true, lastName: true } },
        circuit: { select: { id: true, name: true, country: true } }
      }
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'DB error', detail: String(e.message || e) });
  }
});

// ===== start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Prisma models:', Object.keys(prisma));
  console.log(`API running on http://localhost:${PORT}`);
});