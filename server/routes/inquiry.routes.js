const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createInquiry, getMyInquiries, getMySentInquiries, updateInquiryStatus } = require('../controllers/inquiry.controller');

router.post('/', protect, createInquiry);
router.get('/', protect, authorize('agent', 'admin'), getMyInquiries);
router.get('/sent', protect, getMySentInquiries);
router.put('/:id/status', protect, authorize('agent', 'admin'), updateInquiryStatus);

module.exports = router;
