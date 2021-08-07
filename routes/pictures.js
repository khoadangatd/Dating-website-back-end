var express = require('express');
var router = express.Router();
const pictureController =require('../app/controllers/pictureController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/:iduser',authenticateToken,pictureController.getImage);
router.post('/upload',authenticateToken,pictureController.uploadImage);
router.delete('/:idpic',authenticateToken,pictureController.deleteImage);
// router.put('/update',settingController.updateSetting);

module.exports = router;