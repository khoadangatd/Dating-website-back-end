const Report = require('../models/Report');
const Feedback = require('../models/Feedback');
var nodemailer = require('nodemailer');

class replyController {
    async getReport(req, res) {
        try {
            const rp = await Report.find().populate('target', 'avatar name email').populate('user', 'avatar name');
            res.status(200).json({
                message: "Tất cả tố cáo của người dùng",
                data: rp
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    async getFeedback(req, res) {
        try {
            const fb = await Feedback.find().populate('user');
            res.status(200).json({
                message: "Tất cả phản hồi của người dùng",
                data: fb
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    async reportUser(req, res) {
        const form = req.body;
        try {
            const report = new Report({
                user: req.user._id,
                target: req.body.targetId,
                detail: req.body.detail,
                reason: req.body.reason
            });
            await report.save();
            res.status(200).json({
                message: "Đã tố cáo người dùng",
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    warningUser(req, res) {
        const form = req.body;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kdangatd@gmail.com',
                pass: '12345678aA',
            }
        });
        var mailOptions = {
            from: 'kdangatd@gmail.com',
            to: form.email,
            subject: "Cảnh báo có tố cáo HAPE",
            html:
                `<table align="center">
                    <tbody>
                        <tr>
                            <th>
                                <h1 style="color:rgba(0, 156, 230);font-size:40px">HAPE</h1>
                            </th>
                        </tr>
                        <tr>
                            <td style="background-color: #c7caf3; padding: 5px 20px; color:black">
                                <div style="font-size:24px;font-weight:500">Đã có người tố cáo bạn</div> 
                                <div style="font-size:20px">Lý do:</div> 
                                <div style="font-size:18px;font-weight:500">${form.reason}</div> 
                                <div style="font-size:20px">Mô tả chi tiết:</div>
                                <div style="font-size:18px;font-weight:500">${form.detail}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).json({ message: "Có lỗi xảy ra" });
            }
            else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: "Gửi cảnh báo thành công" });
            }
        });
    }

    async deleteReport(req, res) {
        try {
            await Report.deleteOne({ _id: req.body._id });
            res.status(200).json({ message: "Xóa thành công" });
        }
        catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra" });
        }
    }

    async feedbackUser(req, res) {
        const form = req.body;
        try {
            const fb = new Feedback({
                user: req.user._id,
                mess: req.body.mess
            });
            await fb.save();
            res.status(200).json({
                message: "Đã phản hồi thành công",
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = new replyController();