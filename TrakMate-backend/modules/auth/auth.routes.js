// modules/auth/auth.routes.js
const express = require('express');
const {
  loginController,
  registerController,
} = require('./auth.controler.js'); // ai "controler" cu un singur l

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginController);

// POST /api/auth/register
router.post('/register', registerController);

module.exports = router;
