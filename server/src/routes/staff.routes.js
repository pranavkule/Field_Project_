const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staff.controller');

router.use(authMiddleware);

router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', allowRoles('superadmin'), deleteStaff);

module.exports = router;
