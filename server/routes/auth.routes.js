const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, logout, getMe } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
