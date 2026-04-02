const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { logVitalsValidator } = require('../validators/healthValidator');
const { logVitals, getHealthByChild, getAllRecords } = require('../controllers/health.controller');

router.use(authMiddleware);

router.post('/', logVitalsValidator, validate, logVitals);
router.get('/:childId', getHealthByChild);
router.get('/', getAllRecords);

module.exports = router;
