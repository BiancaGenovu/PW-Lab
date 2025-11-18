// modules/auth/auth.business.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('./auth.model.js');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-trackmate';
const JWT_EXPIRES_IN = '7d';

// helpers interne
function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Business logic pentru REGISTER.
 * Primește date crude din controller, aruncă erori dacă e ceva în neregulă.
 */
async function registerUser({ email, password, firstName, lastName }) {
  if (!email || !password || !firstName || !lastName) {
    throw new Error('email, password, firstName, lastName required');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.code = 'EMAIL_TAKEN';
    throw err;
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    email,
    passwordHash,
    firstName,
    lastName,
    role: 'Pilot' // default pentru register normal
  });

  const token = generateToken(user);
  return { user, token };
}

/**
 * Business logic pentru LOGIN.
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('email, password required');
  }

  const user = await findUserByEmail(email);
  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.code = 'BAD_CREDENTIALS';
    throw err;
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.code = 'BAD_CREDENTIALS';
    throw err;
  }

  // scoatem parola înainte să trimitem mai departe
  const { password: _pw, ...safeUser } = user;
  const token = generateToken(safeUser);

  return { user: safeUser, token };
}

module.exports = {
  registerUser,
  loginUser,
  // exportăm și astea în caz că vrem să le folosim la middleware
  generateToken,
  JWT_SECRET
};