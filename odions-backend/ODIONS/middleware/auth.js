// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { message: 'Access token required', status: 401 } });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(403).json({ error: { message: 'Invalid or expired token', status: 403 } });
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: { message: 'Access token required', status: 401 } });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Admin access required', status: 403 } });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
