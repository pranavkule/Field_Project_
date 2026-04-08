const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getPublicDonations = async (req, res, next) => {
  const donations = await prisma.donation.findMany({
    where: { is_active: true },
    orderBy: { date_received: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, donations, 'Public donations fetched successfully'));
};

const getAllDonations = async (req, res, next) => {
  const donations = await prisma.donation.findMany({
    orderBy: { date_received: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, donations, 'All donations fetched successfully'));
};

const createDonation = async (req, res, next) => {
  const {
    item_name,
    category,
    quantity_required,
    quantity_received,
    priority,
    donor_name,
    date_received,
    is_active
  } = req.body;

  if (!item_name || !category || quantity_required == null || quantity_received == null || !priority || !date_received) {
    return next(new ApiError(400, 'item_name, category, quantity_required, quantity_received, priority, date_received required'));
  }

  const donation = await prisma.donation.create({
    data: {
      item_name,
      category,
      quantity_required: parseInt(quantity_required, 10),
      quantity_received: parseInt(quantity_received, 10),
      priority,
      donor_name: donor_name || '',
      date_received: new Date(date_received),
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      user_id: req.user.user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, donation, 'Donation created successfully'));
};

const updateDonation = async (req, res, next) => {
  const { id } = req.params;
  const {
    item_name,
    category,
    quantity_required,
    quantity_received,
    priority,
    donor_name,
    date_received,
    is_active
  } = req.body;

  const donation = await prisma.donation.findUnique({ where: { donation_id: id } });
  if (!donation) {
    return next(new ApiError(404, 'Donation not found'));
  }

  const data = {};
  if (item_name !== undefined) data.item_name = item_name;
  if (category !== undefined) data.category = category;
  if (quantity_required !== undefined) data.quantity_required = parseInt(quantity_required, 10);
  if (quantity_received !== undefined) data.quantity_received = parseInt(quantity_received, 10);
  if (priority !== undefined) data.priority = priority;
  if (donor_name !== undefined) data.donor_name = donor_name;
  if (date_received !== undefined) data.date_received = new Date(date_received);
  if (is_active !== undefined) data.is_active = Boolean(is_active);

  const updated = await prisma.donation.update({
    where: { donation_id: id },
    data
  });

  return res.status(200).json(new ApiResponse(200, updated, 'Donation updated successfully'));
};

const deleteDonation = async (req, res, next) => {
  const { id } = req.params;

  const donation = await prisma.donation.findUnique({ where: { donation_id: id } });
  if (!donation) {
    return next(new ApiError(404, 'Donation not found'));
  }

  await prisma.donation.delete({ where: { donation_id: id } });

  return res.status(200).json(new ApiResponse(200, null, 'Donation deleted successfully'));
};

module.exports = {
  getPublicDonations,
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation
};
