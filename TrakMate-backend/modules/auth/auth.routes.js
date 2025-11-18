// modules/auth/auth.routes.js
const express = require('express');

// ATENȚIE: folosește exact același nume de fișier ca la tine:
// ai zis că se numește auth.controler.js, deci:
const { registerController, loginController } = require('./auth.controler.js');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerController);

// POST /api/auth/login
router.post('/login', loginController);

module.exports = router;