const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const { getAllItems, addItem, updateItem, deleteItem } = require('../controllers/inventory.controller');

router.use(authMiddleware);

router.get('/', getAllItems);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', allowRoles('superadmin'), deleteItem);

module.exports = router;
