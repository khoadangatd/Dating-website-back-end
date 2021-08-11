var express = require('express');
var router = express.Router();
const userController =require('../app/controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
/* GET users listing. */
router.get('/registerMonth/:year',authenticateToken,userController.getUserRegisterbyMonth);
router.get('/resdetailMonth/:year',authenticateToken,userController.getUserDetailbyMonth);
router.get('/confirmMail/:confirmCode',userController.confirmMail);
router.get('/totalUser',userController.getTotalUser);
router.get('/all',authenticateToken,userController.getAllUser);
router.get('/:_id',authenticateToken,userController.getOther);
router.get('/',authenticateToken,userController.getUser);
router.post('/updatePassword/:confirmCode',userController.updatePassword);
router.post('/forgot',userController.sendMailForgot);
router.post('/login',userController.login);
router.post('/refreshToken',userController.refreshToken);
router.post('/register',userController.register);
router.post('/loginfb',userController.loginFB);
router.post('/findUser',authenticateToken,userController.findUser);
router.post('/matchers',authenticateToken,userController.findUserMatch);
router.post('/likers',authenticateToken,userController.findUserLiked);
router.put('/disable',authenticateToken,userController.diableUser);
router.put('/setting',authenticateToken,userController.editSetting);
router.put('/info',authenticateToken,userController.editInfo);
router.put('/private',authenticateToken,userController.editPrivate);
router.put('/uploadAvatar',authenticateToken,userController.uploadAvatar);

// Có vấn đề nên để socket thì hợp lý hơn
// router.get('/discovery',authenticateToken,userController.findUser);
// router.post('/unlike',authenticateToken,userController.unLikeUser);
// router.get('/match',authenticateToken,userController.getUserMatch);
// router.get('/liked',authenticateToken,userController.getUserLiked);

module.exports = router;
