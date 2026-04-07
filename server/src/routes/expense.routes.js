const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const { getAllExpenses, addExpense, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');

router.use(authMiddleware);

router.get('/summary', getExpenseSummary);
router.get('/', getAllExpenses);
router.post('/', allowRoles('admin'), addExpense);
router.put('/:id', allowRoles('admin'), updateExpense);
router.delete('/:id', allowRoles('admin'), deleteExpense);

module.exports = router;