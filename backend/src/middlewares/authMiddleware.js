const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const verifySession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired session token.' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // Block deactivated users immediately
    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact HR.' });
    }

    // Check if user logged out or never had an active timestamp
    if (!user.last_active_at) {
      return res.status(401).json({ message: 'Session has ended. Please log in again.' });
    }

    // Enforce hard requirement: 15 minutes of inactivity expiration
    const timeoutMinutes = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '15', 10);
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const lastActiveTime = new Date(user.last_active_at).getTime();
    const now = Date.now();

    if (now - lastActiveTime > timeoutMs) {
      // Clear last_active_at to permanently invalidate the expired session
      await user.update({ last_active_at: null });
      return res.status(401).json({
        message: 'Session expired due to 15 minutes of inactivity. Please log in again.'
      });
    }

    // Sliding window: Reset inactivity timer on valid activity
    await user.update({ last_active_at: new Date() });

    req.user = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      manager_id: user.manager_id
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to perform this action.'
      });
    }
    next();
  };
};

module.exports = {
  verifySession,
  requireRole
};