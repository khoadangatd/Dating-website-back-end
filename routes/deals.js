var express = require('express');
var router = express.Router();
const dealController =require('../app/controllers/dealController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/create_payment_url',authenticateToken,dealController.createURLDeal);
router.get('/vnpay_return',dealController.VNpayReturn)
router.get('/',authenticateToken,dealController.getDeal);

module.exports = router;