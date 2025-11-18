// modules/timePilot/timePilot.routes.js
const express = require('express');
const { getPilotTimesController, createPilotTimeController } = require('./timePilot.controller.js');

const router = express.Router();

router.get('/:pilotId', getPilotTimesController);
router.post('/:pilotId/times', createPilotTimeController);

module.exports = router;
