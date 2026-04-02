const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { markAttendance, getAttendanceByStaff, getAllAttendance } = require('../controllers/attendance.controller');

router.use(authMiddleware);

router.post('/', markAttendance);
router.get('/:staffId', getAttendanceByStaff);
router.get('/', getAllAttendance);

module.exports = router;
