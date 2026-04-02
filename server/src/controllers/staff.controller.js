const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAllStaff = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  const [staffList, total] = await Promise.all([
    prisma.staff.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    prisma.staff.count()
  ]);

  return res.status(200).json(new ApiResponse(200, {
    items: staffList,
    page,
    limit,
    total
  }, 'Staff fetched successfully'));
};

const getStaffById = async (req, res, next) => {
  const { id } = req.params;

  const staff = await prisma.staff.findUnique({
    where: { staff_id: id }
  });

  if (!staff) {
    return next(new ApiError(404, 'Staff member not found'));
  }

  return res.status(200).json(new ApiResponse(200, staff, 'Staff member retrieved successfully'));
};

const createStaff = async (req, res, next) => {
  const {
    first_name,
    last_name,
    role,
    contact_number,
    email,
    joining_date,
    salary,
    status
  } = req.body;

  const user_id = req.user.user_id;

  const staff = await prisma.staff.create({
    data: {
      first_name,
      last_name,
      role,
      contact_number,
      email,
      joining_date: joining_date ? new Date(joining_date) : new Date(),
      salary: parseFloat(salary),
      status,
      user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, staff, 'Staff member created successfully'));
};

const updateStaff = async (req, res, next) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (data.joining_date) data.joining_date = new Date(data.joining_date);
  if (data.salary !== undefined) data.salary = parseFloat(data.salary);

  const existingStaff = await prisma.staff.findUnique({ where: { staff_id: id } });
  if (!existingStaff) {
    return next(new ApiError(404, 'Staff member not found'));
  }

  const updatedStaff = await prisma.staff.update({
    where: { staff_id: id },
    data
  });

  return res.status(200).json(new ApiResponse(200, updatedStaff, 'Staff member updated successfully'));
};

const deleteStaff = async (req, res, next) => {
  const { id } = req.params;

  const existingStaff = await prisma.staff.findUnique({ where: { staff_id: id } });
  if (!existingStaff) {
    return next(new ApiError(404, 'Staff member not found'));
  }

  await prisma.staff.delete({ where: { staff_id: id } });

  return res.status(200).json(new ApiResponse(200, null, 'Staff member deleted successfully'));
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
};
