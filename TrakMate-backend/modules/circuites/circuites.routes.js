import { getCircuitesController } from './circuites.controler.js';
import express from 'express';

const router = express.Router();

router.get('/', getCircuitesController);

export default router;
