const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../utils/upload');
const { getUserById, updateUser, deleteUser, toggleFavorite, getFavorites } = require('../controllers/user.controller');

router.get('/favorites/me', protect, getFavorites);
router.post('/favorites/:propertyId', protect, toggleFavorite);

router.get('/:id', getUserById);
router.put('/:id', protect, uploadAvatar.single('avatar'), updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
