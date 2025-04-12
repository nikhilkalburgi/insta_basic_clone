const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/instagram/url', authController.getAuthUrl);
router.get('/instagram/callback', authController.handleCallback);
router.get('/verify', authController.verifyToken);

module.exports = router;