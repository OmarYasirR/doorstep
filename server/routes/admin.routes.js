const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStats, getAllUsers, getAllListings, updateUserRole } = require('../controllers/admin.controller');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/listings', getAllListings);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
