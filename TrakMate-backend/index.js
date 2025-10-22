// index.js — TrakMate backend (Node.js + Express + Prisma)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

/* ============= USERS ============= */

// GET: lista utilizatori
app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST: creează user (Pilot/Admin) — NOTE: pune HASH la parola în producție!
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, password, role = 'Pilot' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email & password required' });
    }
    const created = await prisma.user.create({
      data: { email, name, password, role }
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    // ex. P2002 (unique constraint)
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

/* ============= CIRCUITS ============= */

// GET: lista circuite active
app.get('/api/circuits', async (_req, res) => {
  try {
    const circuits = await prisma.circuit.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(circuits);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST: creează circuit
app.post('/api/circuits', async (req, res) => {
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

/* ============= TIMES (LAPS) ============= */

// GET: lista timpi (cu join la pilot & circuit), ordonați crescător după timp
app.get('/api/times', async (_req, res) => {
  try {
    const times = await prisma.time.findMany({
      orderBy: { lapTimeMs: 'asc' },
      include: {
        pilot: { select: { id: true, name: true, email: true, role: true } },
        circuit: true
      }
    });
    res.json(times);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST: adaugă un timp nou
app.post('/api/times', async (req, res) => {
  try {
    const { pilotId, circuitId, lapTimeMs } = req.body;
    if (!pilotId || !circuitId || lapTimeMs == null) {
      return res.status(400).json({ error: 'pilotId, circuitId, lapTimeMs required' });
    }
    const created = await prisma.time.create({
      data: {
        pilotId: Number(pilotId),
        circuitId: Number(circuitId),
        lapTimeMs: Number(lapTimeMs)
      }
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

/* ============= ALIAS COMPATIBILITATE ============= */
// Dacă ai linkuri vechi pe /api/items, le mapăm la timpi:
app.get('/api/items', async (_req, res) => {
  try {
    const times = await prisma.time.findMany({
      orderBy: { lapTimeMs: 'asc' },
      include: {
        pilot: { select: { id: true, name: true, email: true, role: true } },
        circuit: true
      }
    });
    res.json(times);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

/* ============= START SERVER ============= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
