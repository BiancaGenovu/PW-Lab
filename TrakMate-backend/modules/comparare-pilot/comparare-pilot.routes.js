// modules/comparare-pilot/comparare-pilot.routes.js
const express = require('express');
const { comparePilotsControler } = require('./comparare-pilot.controler.js');

const router = express.Router();

// GET /api/comparare-pilot/:myPilotId/:rivalPilotId/:circuitId
router.get('/:myPilotId/:rivalPilotId/:circuitId', comparePilotsControler);

module.exports = router;