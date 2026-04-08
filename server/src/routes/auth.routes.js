const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  register,
  login,
  me,
  getRegistrationRequests,
  getRegistrationRequestStatus,
  approveRegistrationRequest,
  declineRegistrationRequest,
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerValidator } = require('../validators/authValidator');

// Rate limiter: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, login);
router.get('/me', authMiddleware, me);
router.get('/registration-requests/status/:id', getRegistrationRequestStatus);
router.get('/registration-requests', authMiddleware, getRegistrationRequests);
router.post('/registration-requests/:id/approve', authMiddleware, approveRegistrationRequest);
router.post('/registration-requests/:id/decline', authMiddleware, declineRegistrationRequest);

module.exports = router;
