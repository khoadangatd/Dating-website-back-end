const Report = require('../models/Report');
const Feedback = require('../models/Feedback');

class replyController {
    async getReport(req, res) {
        try {
            const rp = await Report.find();
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
            const fb = await Feedback.find();
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
                target:req.body.targetId,
                detail:req.body.detail,
                reason:req.body.reason
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