// routes/feedRoutes.js
const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', feedController.getUserFeed);
router.get('/media/:mediaId/comments', feedController.getMediaComments);
router.post('/media/:mediaId/comments', feedController.postComment);
router.post('/comments/:commentId/replies', feedController.replyToComment);

module.exports = router;