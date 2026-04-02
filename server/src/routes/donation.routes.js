const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getPublicDonations, getAllDonations, createDonation, updateDonation, deleteDonation } = require('../controllers/donation.controller');

// Public route (no auth)
router.get('/public', getPublicDonations);

// Protected routes
router.use(authMiddleware);
router.get('/', getAllDonations);
router.post('/', createDonation);
router.put('/:id', updateDonation);
router.delete('/:id', deleteDonation);

module.exports = router;
