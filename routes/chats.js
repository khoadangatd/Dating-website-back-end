var express = require('express');
var router = express.Router();
const chatController =require('../app/controllers/chatController');
const authenticateToken = require('../middlewares/authenticateToken');

// router.get('/message/:iduser',authenticateToken,chatController.getMessage);
router.get('/message/newest/:idconversation',authenticateToken,chatController.getlastMessage);
router.get('/conversation/',authenticateToken,chatController.getConversation);
router.get('/conversation/:idconversation',authenticateToken,chatController.getConversation);
router.get('/message/:idconversation',authenticateToken,chatController.getMessageConversation);
router.get('/count/:year',chatController.countAllMessage);
// router.put('/update',settingController.updateSetting);

module.exports = router;