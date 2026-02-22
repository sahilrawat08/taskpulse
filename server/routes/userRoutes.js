const express = require('express');
const { getMe, updateProfile, changePassword, searchUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/search', protect, searchUsers);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
