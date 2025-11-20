// modules/auth/auth.middleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-trackmate';

/**
 * Middleware care verifică token-ul JWT trimis în Authorization: Bearer <token>.
 * Dacă e valid, pune payload-ul în req.user și continuă.
 */
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';

  // Ne așteptăm la "Bearer token"
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload conține ce am pus în generateToken: id, email, role
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Middleware pentru a permite doar un anumit rol (ex: Admin).
 * Exemplu de utilizare: app.get('/admin', authRequired, requireRole('Admin'), ...)
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  authRequired,
  requireRole
};