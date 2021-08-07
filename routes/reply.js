var express = require('express');
var router = express.Router();
const replyController = require('../app/controllers/replyController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/report', authenticateToken, replyController.getReport);
router.get('/feedback', authenticateToken, replyController.getFeedback);
router.get('/notify', authenticateToken, replyController.getNotify);
router.post('/report', authenticateToken, replyController.reportUser);
router.post('/feedback', authenticateToken, replyController.feedbackUser);
router.post('/warning', authenticateToken, replyController.warningUser);
router.post('/notify/:type', authenticateToken, replyController.createNotify);
router.delete('/notify/:type', authenticateToken, replyController.deleteNotify);
router.delete('/', authenticateToken, replyController.deleteReport);


module.exports = router;