const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAllItems = async (req, res, next) => {
  const items = await prisma.inventory.findMany({
    orderBy: { last_updated: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, items, 'Inventory fetched successfully'));
};

const addItem = async (req, res, next) => {
  const { item_name, category, quantity_available } = req.body;

  if (!item_name || !category || quantity_available == null) {
    return next(new ApiError(400, 'item_name, category, quantity_available are required'));
  }

  const item = await prisma.inventory.create({
    data: {
      item_name,
      category,
      quantity_available: parseInt(quantity_available, 10),
      user_id: req.user.user_id,
      last_updated: new Date()
    }
  });

  return res.status(201).json(new ApiResponse(201, item, 'Inventory item added successfully'));
};

const updateItem = async (req, res, next) => {
  const { id } = req.params;
  const { item_name, category, quantity_available } = req.body;

  const existingItem = await prisma.inventory.findUnique({ where: { item_id: id } });
  if (!existingItem) {
    return next(new ApiError(404, 'Inventory item not found'));
  }

  const data = {
    last_updated: new Date()
  };

  if (item_name !== undefined) data.item_name = item_name;
  if (category !== undefined) data.category = category;
  if (quantity_available !== undefined) data.quantity_available = parseInt(quantity_available, 10);

  const updatedItem = await prisma.inventory.update({
    where: { item_id: id },
    data
  });

  return res.status(200).json(new ApiResponse(200, updatedItem, 'Inventory item updated successfully'));
};

const deleteItem = async (req, res, next) => {
  const { id } = req.params;

  const existingItem = await prisma.inventory.findUnique({ where: { item_id: id } });
  if (!existingItem) {
    return next(new ApiError(404, 'Inventory item not found'));
  }

  await prisma.inventory.delete({ where: { item_id: id } });

  return res.status(200).json(new ApiResponse(200, null, 'Inventory item deleted successfully'));
};

module.exports = {
  getAllItems,
  addItem,
  updateItem,
  deleteItem
};