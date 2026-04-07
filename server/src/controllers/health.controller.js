const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const logVitals = async (req, res, next) => {
  const {
    child_id,
    weight,
    height,
    temperature,
    blood_pressure,
    pulse,
    medical_notes,
    record_date
  } = req.body;

  if (!child_id || weight == null || height == null || temperature == null || !blood_pressure || pulse == null || !record_date) {
    return next(new ApiError(400, 'child_id, weight, height, temperature, blood_pressure, pulse, record_date are required'));
  }

  const child = await prisma.child.findUnique({ where: { child_id } });
  if (!child) {
    return next(new ApiError(404, 'Child not found'));
  }

  const newRecord = await prisma.healthRecord.create({
    data: {
      child_id,
      weight: parseFloat(weight),
      height: parseFloat(height),
      temperature: parseFloat(temperature),
      blood_pressure,
      pulse: parseInt(pulse, 10),
      medical_notes,
      record_date: new Date(record_date),
      user_id: req.user.user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, newRecord, 'Health record created successfully'));
};

const updateVitals = async (req, res, next) => {
  const { id } = req.params;
  const {
    child_id,
    weight,
    height,
    temperature,
    blood_pressure,
    pulse,
    medical_notes,
    record_date
  } = req.body;

  const existingRecord = await prisma.healthRecord.findUnique({ where: { health_id: id } });
  if (!existingRecord) {
    return next(new ApiError(404, 'Health record not found'));
  }

  const updatedRecord = await prisma.healthRecord.update({
    where: { health_id: id },
    data: {
      ...(child_id !== undefined ? { child_id } : {}),
      ...(weight !== undefined ? { weight: parseFloat(weight) } : {}),
      ...(height !== undefined ? { height: parseFloat(height) } : {}),
      ...(temperature !== undefined ? { temperature: parseFloat(temperature) } : {}),
      ...(blood_pressure !== undefined ? { blood_pressure } : {}),
      ...(pulse !== undefined ? { pulse: parseInt(pulse, 10) } : {}),
      ...(medical_notes !== undefined ? { medical_notes } : {}),
      ...(record_date !== undefined ? { record_date: new Date(record_date) } : {}),
    }
  });

  return res.status(200).json(new ApiResponse(200, updatedRecord, 'Health record updated successfully'));
};

const getHealthByChild = async (req, res, next) => {
  const { childId } = req.params;

  const child = await prisma.child.findUnique({ where: { child_id: childId } });
  if (!child) {
    return next(new ApiError(404, 'Child not found'));
  }

  const records = await prisma.healthRecord.findMany({
    where: { child_id: childId },
    orderBy: { record_date: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, records, 'Health records fetched successfully'));
};

const getAllRecords = async (req, res, next) => {
  const records = await prisma.healthRecord.findMany({
    orderBy: { record_date: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, records, 'All health records fetched successfully'));
};

module.exports = {
  logVitals,
  updateVitals,
  getHealthByChild,
  getAllRecords
};
