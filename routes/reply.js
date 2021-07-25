var express = require('express');
var router = express.Router();
const replyController = require('../app/controllers/replyController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/report', authenticateToken, replyController.getReport);
router.get('/feedback', authenticateToken, replyController.getFeedback);
router.post('/report', authenticateToken, replyController.reportUser);
router.post('/feedback', authenticateToken, replyController.feedbackUser);


module.exports = router;