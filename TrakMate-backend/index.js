// index.js — TrakMate backend (Node.js + Express + Prisma)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// ===== middleware
app.use(cors());
app.use(express.json());

// ===== healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// ===== USERS (pilots/admins)

// GET /api/pilot -> listă utilizatori
app.get('/api/pilot', async (_req, res) => {
  try {
    // Schimbat de la prisma.user la prisma.appUser
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

// POST /api/pilot -> creează utilizator (NOTĂ: pune HASH la parolă în producție)
app.post('/api/pilot', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role = 'Pilot' } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'email, password, firstName, lastName required' });
    }
    // Schimbat de la prisma.user la prisma.appUser
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

// GET /api/times -> timpi cu pilot & circuit
app.get('/api/times', async (_req, res) => {
  try {
    // Schimbat de la prisma.time la prisma.timeRecord
    const times = await prisma.timeRecord.findMany({
      orderBy: { lapTimeMs: 'asc' },
      include: {
        // Obiectul pilot este acum modelul AppUser
        pilot: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        circuit: true
      }
    });
    res.json(times);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/times -> adaugă timp
app.post('/api/times', async (req, res) => {
  try {
    const { pilotId, circuitId, lapTimeMs } = req.body;
    if (!pilotId || !circuitId || lapTimeMs == null) {
      return res.status(400).json({ error: 'pilotId, circuitId, lapTimeMs required' });
    }
    // Schimbat de la prisma.time la prisma.timeRecord
    const created = await prisma.timeRecord.create({
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

// ===== start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // Log de debug actualizat
  console.log('Prisma models:', Object.keys(prisma)); // trebuie să vezi 'appUser', 'circuit', 'timeRecord'
  console.log(`API running on http://localhost:${PORT}`);
});