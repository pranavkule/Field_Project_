const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const { getAllExpenses, addExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');

router.use(authMiddleware);

router.get('/summary', getExpenseSummary);
router.get('/', getAllExpenses);
router.post('/', addExpense);
router.delete('/:id', allowRoles('superadmin'), deleteExpense);

module.exports = router;