var express = require('express');
var router = express.Router();
const userController =require('../app/controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
/* GET users listing. */

router.post('/login',userController.login);
router.post('/refreshToken',userController.refreshToken);
router.post('/register',userController.register);
router.post('/loginfb',userController.loginFB);
router.post('/findUser',authenticateToken,userController.findUser);
router.get('/login',authenticateToken,userController.getUser);
router.put('/setting',authenticateToken,userController.editSetting);
router.put('/info',authenticateToken,userController.editInfo);

// Có vấn đề nên để socket thì hợp lý hơn
// router.get('/discovery',authenticateToken,userController.findUser);
// router.post('/unlike',authenticateToken,userController.unLikeUser);
// router.get('/match',authenticateToken,userController.getUserMatch);
// router.get('/liked',authenticateToken,userController.getUserLiked);

module.exports = router;
