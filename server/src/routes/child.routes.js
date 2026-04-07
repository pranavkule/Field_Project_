const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { createChildValidator } = require('../validators/childValidator');
const {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild
} = require('../controllers/child.controller');

router.use(authMiddleware);

router.get('/', getAllChildren);
router.get('/:id', getChildById);
router.post('/', allowRoles('admin'), createChildValidator, validate, createChild);
router.put('/:id', allowRoles('admin'), updateChild);
router.delete('/:id', allowRoles('admin'), deleteChild);

module.exports = router;
