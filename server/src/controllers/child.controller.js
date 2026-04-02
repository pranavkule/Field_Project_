const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAllChildren = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  const [children, total] = await Promise.all([
    prisma.child.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    prisma.child.count()
  ]);

  return res.status(200).json(new ApiResponse(200, {
    items: children,
    page,
    limit,
    total
  }, 'Children fetched successfully'));
};

const getChildById = async (req, res, next) => {
  const { id } = req.params;

  const child = await prisma.child.findUnique({
    where: { child_id: id }
  });

  if (!child) {
    return next(new ApiError(404, 'Child not found'));
  }

  return res.status(200).json(new ApiResponse(200, child, 'Child retrieved successfully'));
};

const createChild = async (req, res, next) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    admission_date,
    status,
    guardian_name,
    guardian_contact,
    address,
    blood_group,
    medical_condition,
    education_level,
    photo_url
  } = req.body;

  const user_id = req.user.user_id;

  const child = await prisma.child.create({
    data: {
      first_name,
      last_name,
      date_of_birth: new Date(date_of_birth),
      gender,
      admission_date: admission_date ? new Date(admission_date) : new Date(),
      status,
      guardian_name,
      guardian_contact,
      address,
      blood_group,
      medical_condition,
      education_level,
      photo_url,
      user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, child, 'Child created successfully'));
};

const updateChild = async (req, res, next) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (data.date_of_birth) data.date_of_birth = new Date(data.date_of_birth);
  if (data.admission_date) data.admission_date = new Date(data.admission_date);

  const existingChild = await prisma.child.findUnique({ where: { child_id: id } });
  if (!existingChild) {
    return next(new ApiError(404, 'Child not found'));
  }

  const updatedChild = await prisma.child.update({
    where: { child_id: id },
    data
  });

  return res.status(200).json(new ApiResponse(200, updatedChild, 'Child updated successfully'));
};

const deleteChild = async (req, res, next) => {
  const { id } = req.params;

  const existingChild = await prisma.child.findUnique({ where: { child_id: id } });
  if (!existingChild) {
    return next(new ApiError(404, 'Child not found'));
  }

  await prisma.child.delete({ where: { child_id: id } });

  return res.status(200).json(new ApiResponse(200, null, 'Child deleted successfully'));
};

module.exports = {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild
};
