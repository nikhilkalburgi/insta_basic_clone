const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all profile routes
router.use(authMiddleware);

// Get user profile
router.get('/', profileController.getUserProfile);

module.exports = router;