// modules/profile/profile.routes.js
const express = require('express');
const { getMyProfileController } = require('./profile.controler.js');
const { authRequired } = require('../auth/auth.middleware.js'); // ← ADAUGĂ ASTA

const router = express.Router();

// GET /api/profile/me - PROTEJAT cu authRequired
router.get('/me', authRequired, getMyProfileController); // ← ADAUGĂ authRequired

module.exports = router;