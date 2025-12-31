// modules/comparare-top3/comparare-top3.routes.js
const express = require('express');
const { compareTop3Controler } = require('./comparare-top3.controler.js');

const router = express.Router();

// GET /api/comparare-top3/:pilotId/:circuitId
router.get('/:pilotId/:circuitId', compareTop3Controler);

module.exports = router;