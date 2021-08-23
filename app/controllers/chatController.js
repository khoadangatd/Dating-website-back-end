const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

class chatController {
    async getConversation(req, res, next) {
        try {
            const data = await Conversation.find({ members: { $in: req.user._id } })
            res.status(200).json({
                message: "Conversation của người dùng",
                data: data
            });
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    
    async getDetailConversation(req, res, next) {
        try {
            const data = await Conversation.findOne({ conversation: req.params.idconversation });
            res.status(200).json({
                message: "Conversation theo id của người dùng",
                data: data
            });
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    // Lấy tin nhắn gần nhất trong conversation với người dùng khác.
    getlastMessage(req, res) {
        Message.findOne({ conversation: req.params.idconversation }).sort({ createdAt: -1 })
            .then(data => {
                console.log(data);
                res.status(200).json({ message: `Tin nhắn của mới nhất`, data: data });
            })
            .catch((error) => res.status(500).json(error));
    }

    getMessageConversation(req, res) {
        Message.find({ conversation: req.params.idconversation }).limit(50)
            .then(data => {
                res.status(200).json({ message: `Tin nhắn `, data: data });
            })
            .catch((error) => res.status(500).json(error));
    }

    countAllMessage(req, res) {
        Message.countDocuments(
            {
                createdAt: {
                    $gte: new Date(parseInt(req.params.year), 1, 1),
                    $lt: new Date(parseInt(req.params.year), 12, 30)
                }
            })
            .then(data => {
                res.status(200).json({ message: `Tổng cộng tin nhắn`, data: data });
            })
            .catch((error) => res.status(500).json(error));
    }

}

module.exports = new chatController();