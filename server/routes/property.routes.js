const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadPropertyImages } = require('../utils/upload');
const {
  getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getPropertiesByAgent,
} = require('../controllers/property.controller');

router.get('/', getProperties);
router.get('/agent/:agentId', getPropertiesByAgent);
router.get('/:id', getPropertyById);

router.post('/', protect, authorize('agent', 'admin'), uploadPropertyImages.array('images', 12), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), uploadPropertyImages.array('images', 12), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);

module.exports = router;
