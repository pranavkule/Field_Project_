const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const { getAllItems, addItem, updateItem, deleteItem } = require('../controllers/inventory.controller');

router.use(authMiddleware);

router.get('/', getAllItems);
router.post('/', allowRoles('admin'), addItem);
router.put('/:id', allowRoles('admin'), updateItem);
router.delete('/:id', allowRoles('admin'), deleteItem);

module.exports = router;
