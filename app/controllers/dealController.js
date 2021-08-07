const Conversation = require("../models/Conversation");
const Deal = require("../models/Deal");
const User = require("../models/User");
class dealController {
    async getDeal(req, res) {
        try {
            const deals = await Deal.find().populate('user').sort({ createdAt: -1 });
            res.status(200).json({
                message: "Lịch sử giao dịch",
                data:deals
            })
        }
        catch (err) {
            res.status(500).json("Có lỗi xảy ra")
        }
    }
    async createURLDeal(req, res, next) {
        const check = await User.findById(req.user._id);
        console.log(req.body.credit);
        if (req.body.credit != check.credit) return res.status(500).json({
            message: "Giao dịch thất bại"
        })
        // Xử lý credit
        // const credit = req.body.money / 100;
        // await User.updateOne({ _id: req.user._id }, { credit: check.credit + credit });
        var deal = new Deal({
            user: req.user._id,
            mess: "Mua tiền HP",
            money: req.body.money,
        })
        deal= await deal.save();
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var dateFormat = require('dateformat');


        var tmnCode = "1SNJ89L8";
        var secretKey = "ODJLXOCEWMFIEJXHJNMZUVFFVRDDXLOT";
        var vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = "http://localhost/deals/vnpay_return";

        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = deal._id+"-"+dateFormat(date, 'HHmmss');
        var amount = parseFloat(req.body.money);
        var bankCode = "NCB";

        var desc = 'Thanh toan don hang thoi gian: ' + createDate;
        var orderInfo = desc;
        var orderType = "MuaHP";
        var locale = "vn";
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require('sha256');

        var secureHash = sha256(signData);

        vnp_Params['vnp_SecureHashType'] = 'SHA256';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
        // //Neu muon dung Redirect thi dong dong ben duoi
        res.status(200).json({ code: '00', data: vnpUrl })
    };

    async VNpayReturn(req, res, next) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = "1SNJ89L8";
        var secretKey = "ODJLXOCEWMFIEJXHJNMZUVFFVRDDXLOT";

        var querystring = require('qs');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require('sha256');

        var checkSum = sha256(signData);

        var idOrder=vnp_Params['vnp_TxnRef'].split('-')[0];
        console.log(idOrder);
        if (secureHash === checkSum) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            try {
                // Xử lý credit
                const deal= await Deal.findById(idOrder);
                const credit = deal.money / 100;
                await User.updateOne({ _id: deal.user }, { $inc:{credit:credit }});
                await Deal.updateOne({_id:idOrder},{status:true})
                return res.status(200).json({
                    message: "Giao dịch thành công"
                });
            }
            catch (err) {
                return res.status(500).json({ message: "Có lỗi cơ sở dữ liệu" })
            }
        } else {
            return res.status(500).json({
                message: "Giao dịch thất bại"
            });
        }
    };
    async upgradePremium(req,res){
        // Nâng cấp premium tiêu tốn 500 HP
        if(req.user.role==1){
            try{
                const user =await User.findOneAndUpdate({_id:req.user._id},{$inc:{credit:-500,role:2}});
                if(user.credit<=0){
                    await User.findOneAndUpdate({_id:req.user._id},{$inc:{credit:+500,role:1}});
                    return res.status(500).json({
                        message: "Tài khoản của bạn không đủ HP"
                    });
                }
                return res.status(200).json({
                    message: "Nâng cấp tài khoản Premium thành công"
                });
            }
            catch{

            }
        }
        return res.status(500).json({ message: "Tài khoản của bạn đã premium" })
    }
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

module.exports = new dealController();