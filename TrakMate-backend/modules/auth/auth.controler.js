// modules/auth/auth.controller.js
const { registerUser, loginUser } = require('./auth.business.js');

/**
 * POST /api/auth/register
 */
async function registerController(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    const result = await registerUser({ email, password, firstName, lastName });

    // result = { user, token }
    res.status(201).json(result);
  } catch (err) {
    console.error('Register error:', err);

    if (err.code === 'EMAIL_TAKEN') {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (err.message?.includes('required')) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Failed to register user' });
  }
}

/**
 * POST /api/auth/login
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    // result = { user, token }
    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err);

    if (err.code === 'BAD_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (err.message?.includes('required')) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Failed to login' });
  }
}

module.exports = {
  registerController,
  loginController
};