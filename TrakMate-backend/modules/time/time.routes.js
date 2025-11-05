// modules/time/time.routes.js
import express from 'express';
import { getTimesController, createTimeController, getCircuitTimesController } from './time.controller.js';

const router = express.Router();

// 1. GET /api/time -> Listează toți timpii
router.get('/', getTimesController);

// 2. POST /api/time -> Creează un nou timp (Exemplu)
router.post('/', createTimeController);

// 3. RUTA NOUĂ PENTRU FILTRARE: GET /api/time/circuit/:circuitId
// Această rută va fi folosită de componenta Angular TimpCircuitComponent.
router.get('/circuit/:circuitId', getCircuitTimesController); 

export default router;