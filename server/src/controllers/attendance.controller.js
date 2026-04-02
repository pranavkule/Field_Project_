const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const markAttendance = async (req, res, next) => {
  const { staff_id, attendance_date, status, remarks } = req.body;

  if (!staff_id || !attendance_date || !status) {
    return next(new ApiError(400, 'staff_id, attendance_date, and status are required'));
  }

  const staff = await prisma.staff.findUnique({ where: { staff_id } });
  if (!staff) {
    return next(new ApiError(404, 'Staff member not found'));
  }

  const attendance = await prisma.staffAttendance.create({
    data: {
      staff_id,
      attendance_date: new Date(attendance_date),
      status,
      remarks: remarks || '',
      user_id: req.user.user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, attendance, 'Attendance recorded successfully'));
};

const getAttendanceByStaff = async (req, res, next) => {
  const { staffId } = req.params;

  const staff = await prisma.staff.findUnique({ where: { staff_id: staffId } });
  if (!staff) {
    return next(new ApiError(404, 'Staff member not found'));
  }

  const records = await prisma.staffAttendance.findMany({
    where: { staff_id: staffId },
    orderBy: { attendance_date: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, records, 'Attendance records fetched successfully'));
};

const getAllAttendance = async (req, res, next) => {
  const { date } = req.query;

  const where = {};
  if (date) {
    // Normalize to full day filter
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.attendance_date = {
      gte: start,
      lte: end
    };
  }

  const records = await prisma.staffAttendance.findMany({
    where,
    orderBy: { attendance_date: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, records, 'All attendance records fetched successfully'));
};

module.exports = {
  markAttendance,
  getAttendanceByStaff,
  getAllAttendance
};
