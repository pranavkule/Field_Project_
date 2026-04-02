const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getSummary } = require('../controllers/dashboard.controller');

router.use(authMiddleware);

router.get('/summary', getSummary);

module.exports = router;
