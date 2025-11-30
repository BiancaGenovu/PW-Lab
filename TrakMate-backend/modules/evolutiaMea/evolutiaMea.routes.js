// modules/evolutiaMea/evolutiaMea.routes.js
const express = require('express');
const { getEvolutionControler } = require('./evolutiaMea.controler.js');

const router = express.Router();

// GET /api/evolutia-mea/:pilotId/:circuitId
router.get('/:pilotId/:circuitId', getEvolutionControler);

module.exports = router;