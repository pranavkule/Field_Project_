const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { logVitalsValidator } = require('../validators/healthValidator');
const { logVitals, updateVitals, getHealthByChild, getAllRecords } = require('../controllers/health.controller');

router.use(authMiddleware);

router.post('/', allowRoles('admin'), logVitalsValidator, validate, logVitals);
router.put('/:id', allowRoles('admin'), logVitalsValidator, validate, updateVitals);
router.get('/:childId', getHealthByChild);
router.get('/', getAllRecords);

module.exports = router;
