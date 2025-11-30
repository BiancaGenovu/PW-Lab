// index.js — TrakMate backend (Node.js + Express + Prisma)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Importă funcțiile de model necesare din module
const { getTimesByPilotId } = require('./modules/timePilot/timePilot.model.js');

// IMPORT: routerul de auth
const authRouter = require('./modules/auth/auth.routes.js');

// IMPORT NOU: routerul de profil
const profileRouter = require('./modules/profile/profile.routes.js');

// IMPORT: middleware de autentificare
const { authRequired } = require('./modules/auth/auth.middleware.js');

const app = express();
const prisma = new PrismaClient();

// ===== middleware
app.use(cors());
app.use(express.json());

// ===== HELPER FUNCTIONS pentru sectoare =====

// Helper: calculează timpul total din sectoare
function calculateTotalTime(sector1Ms, sector2Ms, sector3Ms) {
  return sector1Ms + sector2Ms + sector3Ms;
}

// Helper: parsează timp în format MM:SS.mmm sau miliseconde
function parseLapToMs(input) {
  if (typeof input === 'number') return input;
  const s = String(input).trim();
  if (/^\d+$/.test(s)) return Number(s); // doar ms

  // MM:SS.mmm (sau M:SS.mmm)
  const m = s.match(/^(\d+):([0-5]?\d)\.(\d{1,3})$/);
  if (!m) throw new Error('Invalid time format (use ms or MM:SS.mmm)');
  const minutes = Number(m[1]);
  const seconds = Number(m[2]);
  const millis  = Number(m[3].padEnd(3, '0'));
  return minutes * 60_000 + seconds * 1_000 + millis;
}

// Helper: convertește ms în MM:SS.mmm
function formatMsToTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

// ===== Servire fișiere statice (imagini)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Configurare Multer pentru upload imagini

// Storage pentru poze de profil
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage pentru poze de circuite
const circuitStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/circuits/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtrare: doar imagini
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const uploadProfile = multer({ 
  storage: profileStorage, 
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

const uploadCircuit = multer({ 
  storage: circuitStorage, 
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

// ===== healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// ===== AUTH (login/register) – montăm routerul /api/auth
app.use('/api/auth', authRouter);

// ===== PROFILE (me) – montăm routerul /api/profile
app.use('/api/profile', profileRouter);

// ===== USERS (pilots/admins)

// GET /api/pilot -> listă utilizatori
app.get('/api/pilot', async (_req, res) => {
  try {
    const users = await prisma.appUser.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, profileImage: true, createdAt: true }
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

// PUT /api/pilot/:pilotId/upload-image -> upload imagine profil (Admin sau propriul profil)
app.put('/api/pilot/:pilotId/upload-image', authRequired, uploadProfile.single('image'), async (req, res) => {
  try {
    const pilotId = Number(req.params.pilotId);
    const loggedUserId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!pilotId) {
      return res.status(400).json({ error: 'Invalid pilotId' });
    }

    // Verificare: Admin poate edita oricine, Pilot doar pe el însuși
    if (!isAdmin && loggedUserId !== pilotId) {
      return res.status(403).json({ error: 'You can only upload your own profile image' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Construiește URL-ul imaginii
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    // Actualizează în baza de date
    const updated = await prisma.appUser.update({
      where: { id: pilotId },
      data: { profileImage: imageUrl }
    });

    res.status(200).json({ message: 'Image uploaded successfully', profileImage: imageUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed', detail: String(e.message || e) });
  }
});

// DELETE /api/pilot/:pilotId -> șterge pilot (DOAR ADMIN)
app.delete('/api/pilot/:pilotId', authRequired, async (req, res) => {
  try {
    const pilotId = Number(req.params.pilotId);
    const isAdmin = req.user.role === 'Admin';

    // Verifică că userul e Admin
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can delete pilots' });
    }

    if (!pilotId) {
      return res.status(400).json({ error: 'Invalid pilotId' });
    }

    // Verifică că pilotul există
    const pilot = await prisma.appUser.findUnique({
      where: { id: pilotId }
    });

    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    // Nu permite ștergerea propriului cont de admin
    if (req.user.id === pilotId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Șterge pilotul (Prisma va șterge automat timpiile datorită onDelete: Cascade)
    await prisma.appUser.delete({
      where: { id: pilotId }
    });

    res.status(200).json({ message: 'Pilot deleted successfully' });
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
      orderBy: { name: 'asc' },
      select: { id: true, name: true, km: true, country: true, circuitImage: true, createdAt: true }
    });
    res.json(circuites);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/circuites -> adaugă circuit (DOAR ADMIN)
app.post('/api/circuites', authRequired, async (req, res) => {
  try {
    const { name, km, country } = req.body;
    const isAdmin = req.user.role === 'Admin';

    // Verifică că userul e Admin
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can add circuits' });
    }

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

// PUT /api/circuites/:circuitId -> editează circuit (DOAR ADMIN)
app.put('/api/circuites/:circuitId', authRequired, async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const { name, km, country } = req.body;
    const isAdmin = req.user.role === 'Admin';

    // Verifică că userul e Admin
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can edit circuits' });
    }

    if (!circuitId) {
      return res.status(400).json({ error: 'Invalid circuitId' });
    }

    if (!name || km == null || !country) {
      return res.status(400).json({ error: 'name, km, country required' });
    }

    // Verifică că circuitul există
    const circuit = await prisma.circuit.findUnique({
      where: { id: circuitId }
    });

    if (!circuit) {
      return res.status(404).json({ error: 'Circuit not found' });
    }

    // Actualizează circuitul
    const updated = await prisma.circuit.update({
      where: { id: circuitId },
      data: { 
        name, 
        km: Number(km), 
        country 
      }
    });

    res.status(200).json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// PUT /api/circuites/:circuitId/upload-image -> upload imagine circuit (DOAR ADMIN)
app.put('/api/circuites/:circuitId/upload-image', authRequired, uploadCircuit.single('image'), async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const isAdmin = req.user.role === 'Admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can upload circuit images' });
    }

    if (!circuitId) {
      return res.status(400).json({ error: 'Invalid circuitId' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Construiește URL-ul imaginii
    const imageUrl = `/uploads/circuits/${req.file.filename}`;

    // Actualizează în baza de date
    const updated = await prisma.circuit.update({
      where: { id: circuitId },
      data: { circuitImage: imageUrl }
    });

    res.status(200).json({ message: 'Image uploaded successfully', circuitImage: imageUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed', detail: String(e.message || e) });
  }
});

// DELETE /api/circuites/:circuitId -> șterge circuit (DOAR ADMIN)
app.delete('/api/circuites/:circuitId', authRequired, async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const isAdmin = req.user.role === 'Admin';

    // Verifică că userul e Admin
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can delete circuits' });
    }

    if (!circuitId) {
      return res.status(400).json({ error: 'Invalid circuitId' });
    }

    // Verifică că circuitul există
    const circuit = await prisma.circuit.findUnique({
      where: { id: circuitId }
    });

    if (!circuit) {
      return res.status(404).json({ error: 'Circuit not found' });
    }

    // Șterge circuitul (Prisma va șterge automat timpii datorită onDelete: Cascade)
    await prisma.circuit.delete({
      where: { id: circuitId }
    });

    res.status(200).json({ message: 'Circuit deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// ===== TIMES (laps) - CU SECTOARE =====

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

// GET /api/circuites/:circuitId/times -> toți timpii pentru un circuit CU SECTOARE
app.get('/api/circuites/:circuitId/times', async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    if (!circuitId) return res.status(400).json({ error: 'Invalid circuitId' });

    const times = await prisma.timeRecord.findMany({
      where: { circuitId },
      select: {
        id: true,
        sector1Ms: true,
        sector2Ms: true,
        sector3Ms: true,
        createdAt: true,
        pilot:   { select: { id: true, firstName: true, lastName: true } },
        circuit: { select: { id: true, name: true } }
      }
    });

    // Calculează timpul total pentru fiecare record
    const timesWithTotal = times.map(t => ({
      ...t,
      lapTimeMs: calculateTotalTime(t.sector1Ms, t.sector2Ms, t.sector3Ms)
    }));

    // Sortează după timpul total
    timesWithTotal.sort((a, b) => a.lapTimeMs - b.lapTimeMs);

    res.json(timesWithTotal);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/circuites/:circuitId/times -> adaugă timp cu sectoare
app.post('/api/circuites/:circuitId/times', authRequired, async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const { sector1, sector2, sector3, pilotId: bodyPilotId } = req.body;
    const loggedUserId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!circuitId) return res.status(400).json({ error: 'Invalid circuitId' });
    if (sector1 == null || sector2 == null || sector3 == null) {
      return res.status(400).json({ error: 'sector1, sector2, sector3 required' });
    }

    // Determină pilotId: Admin poate specifica, Pilot adaugă pentru el
    let pilotId;
    if (isAdmin && bodyPilotId) {
      pilotId = Number(bodyPilotId);
    } else if (req.user.role === 'Pilot') {
      pilotId = loggedUserId;
    } else {
      return res.status(403).json({ error: 'Only pilots and admins can add times' });
    }

    // Parsează timpii sectoare
    const sector1Ms = parseLapToMs(sector1);
    const sector2Ms = parseLapToMs(sector2);
    const sector3Ms = parseLapToMs(sector3);

    const created = await prisma.timeRecord.create({
      data: { 
        pilotId, 
        circuitId, 
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
        circuit: { select: { id: true, name: true } }
      }
    });

    // Adaugă timpul total calculat
    const response = {
      ...created,
      lapTimeMs: calculateTotalTime(created.sector1Ms, created.sector2Ms, created.sector3Ms)
    };

    res.status(201).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// DELETE /api/circuites/:circuitId/times/:timeId -> șterge timpul propriu SAU admin șterge orice
app.delete('/api/circuites/:circuitId/times/:timeId', authRequired, async (req, res) => {
  try {
    const circuitId = Number(req.params.circuitId);
    const timeId = Number(req.params.timeId);
    const loggedUserId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!circuitId || !timeId) {
      return res.status(400).json({ error: 'Invalid circuitId or timeId' });
    }

    // Verifică că timpul există
    const existingTime = await prisma.timeRecord.findUnique({
      where: { id: timeId },
      select: { id: true, pilotId: true, circuitId: true }
    });

    if (!existingTime) {
      return res.status(404).json({ error: 'Time record not found' });
    }

    if (existingTime.circuitId !== circuitId) {
      return res.status(400).json({ error: 'Time does not belong to this circuit' });
    }

    // Admin poate șterge orice, Pilot doar timpul lui
    if (!isAdmin && existingTime.pilotId !== loggedUserId) {
      return res.status(403).json({ error: 'You can only delete your own times' });
    }

    // Șterge timpul
    await prisma.timeRecord.delete({
      where: { id: timeId }
    });

    res.status(200).json({ message: 'Time deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

// POST /api/timePilot/:pilotId/times -> adaugă timp cu sectoare pentru pilot
app.post('/api/timePilot/:pilotId/times', authRequired, async (req, res) => {
  try {
    const pilotId = Number(req.params.pilotId);
    const { circuitName, country, sector1, sector2, sector3 } = req.body;
    const loggedUserId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!pilotId) return res.status(400).json({ message: 'Invalid pilotId' });
    
    // VERIFICARE: Pilot doar pentru el, Admin pentru oricine
    if (!isAdmin && loggedUserId !== pilotId) {
      return res.status(403).json({ message: 'You can only add times for yourself' });
    }

    if (!circuitName || !country || sector1 == null || sector2 == null || sector3 == null) {
      return res.status(400).json({ message: 'circuitName, country, sector1, sector2, sector3 required' });
    }

    const circuit = await prisma.circuit.findFirst({
      where: {
        name:    { equals: String(circuitName).trim(), mode: 'insensitive' },
        country: { equals: String(country).trim(),     mode: 'insensitive' },
        isActive: true
      },
      select: { id: true, name: true, country: true }
    });
    if (!circuit) return res.status(400).json({ message: 'Circuit not found' });

    // Parsează timpii sectoare
    const sector1Ms = parseLapToMs(sector1);
    const sector2Ms = parseLapToMs(sector2);
    const sector3Ms = parseLapToMs(sector3);

    const created = await prisma.timeRecord.create({
      data: { 
        pilotId, 
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
    const response = {
      ...created,
      lapTimeMs: calculateTotalTime(created.sector1Ms, created.sector2Ms, created.sector3Ms)
    };

    res.status(201).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'DB error', detail: String(e.message || e) });
  }
});

// DELETE /api/timePilot/:pilotId/times/:timeId -> șterge timpul propriu SAU admin șterge orice
app.delete('/api/timePilot/:pilotId/times/:timeId', authRequired, async (req, res) => {
  try {
    const pilotId = Number(req.params.pilotId);
    const timeId = Number(req.params.timeId);
    const loggedUserId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!pilotId || !timeId) {
      return res.status(400).json({ error: 'Invalid pilotId or timeId' });
    }

    // Verifică că timpul există
    const existingTime = await prisma.timeRecord.findUnique({
      where: { id: timeId },
      select: { id: true, pilotId: true }
    });

    if (!existingTime) {
      return res.status(404).json({ error: 'Time record not found' });
    }

    // Admin poate șterge orice, Pilot doar timpul lui din pagina lui
    if (!isAdmin) {
      if (loggedUserId !== pilotId || existingTime.pilotId !== pilotId) {
        return res.status(403).json({ error: 'You can only delete your own times' });
      }
    }

    // Șterge timpul
    await prisma.timeRecord.delete({
      where: { id: timeId }
    });

    res.status(200).json({ message: 'Time deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', detail: String(e.message || e) });
  }
});

const evolutiaMeaRouter = require('./modules/evolutiaMea/evolutiaMea.routes.js');
app.use('/api/evolutia-mea', evolutiaMeaRouter);

// ===== start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Prisma models:', Object.keys(prisma));
  console.log(`API running on http://localhost:${PORT}`);
});