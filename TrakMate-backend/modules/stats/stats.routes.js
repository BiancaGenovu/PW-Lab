const express = require('express');
const router = express.Router();
const statsController = require('./stats.controler.js');

// GET /api/stats
router.get('/', statsController.getStats);

module.exports = router;