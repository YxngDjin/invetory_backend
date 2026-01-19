import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'No token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated ${decoded.id} (${decoded.role})`);
    next();
  } catch (e) {
    logger.error('Authentication error:', e);

    if (e.message === 'Failed to authenticate token') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error',
    });
  }
};

export const requireRole = allowedRoles => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'User not authenticated',
        });
      }
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
        );
        return res.status(403).json({
          error: 'Access denied',
          message: 'Insufficient permissions',
        });
      }
      next();
    } catch (e) {
      logger.error('Role verification error:', e);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error during role verification',
      });
    }
  };
};
