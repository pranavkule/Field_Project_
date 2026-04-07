const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAllExpenses = async (req, res, next) => {
  const expenses = await prisma.expense.findMany({
    orderBy: { expense_date: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, expenses, 'Expenses fetched successfully'));
};

const addExpense = async (req, res, next) => {
  const { expense_category, description, amount, expense_date, payment_mode } = req.body;

  if (!expense_category || !description || amount == null || !expense_date || !payment_mode) {
    return next(new ApiError(400, 'expense_category, description, amount, expense_date, payment_mode are required'));
  }

  const expense = await prisma.expense.create({
    data: {
      expense_category,
      description,
      amount: parseFloat(amount),
      expense_date: new Date(expense_date),
      payment_mode,
      user_id: req.user.user_id
    }
  });

  return res.status(201).json(new ApiResponse(201, expense, 'Expense added successfully'));
};

const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { expense_category, description, amount, expense_date, payment_mode } = req.body;

  const existingExpense = await prisma.expense.findUnique({ where: { expense_id: id } });
  if (!existingExpense) {
    return next(new ApiError(404, 'Expense not found'));
  }

  const updatedExpense = await prisma.expense.update({
    where: { expense_id: id },
    data: {
      ...(expense_category !== undefined ? { expense_category } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(amount !== undefined ? { amount: parseFloat(amount) } : {}),
      ...(expense_date !== undefined ? { expense_date: new Date(expense_date) } : {}),
      ...(payment_mode !== undefined ? { payment_mode } : {}),
    }
  });

  return res.status(200).json(new ApiResponse(200, updatedExpense, 'Expense updated successfully'));
};

const deleteExpense = async (req, res, next) => {
  const { id } = req.params;

  const existingExpense = await prisma.expense.findUnique({ where: { expense_id: id } });
  if (!existingExpense) {
    return next(new ApiError(404, 'Expense not found'));
  }

  await prisma.expense.delete({ where: { expense_id: id } });

  return res.status(200).json(new ApiResponse(200, null, 'Expense deleted successfully'));
};

const getExpenseSummary = async (req, res, next) => {
  const totalResult = await prisma.expense.aggregate({
    _sum: { amount: true }
  });

  const byCategory = await prisma.expense.groupBy({
    by: ['expense_category'],
    _sum: { amount: true }
  });

  const response = {
    total: totalResult._sum.amount || 0,
    byCategory: byCategory.map((item) => ({
      category: item.expense_category,
      total: item._sum.amount || 0
    }))
  };

  return res.status(200).json(new ApiResponse(200, response, 'Expense summary fetched successfully'));
};

module.exports = {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};