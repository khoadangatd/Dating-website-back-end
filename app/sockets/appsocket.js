const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Message = require("../models/Message");

class AppSocket{
    async likeUser(_id, _idother) {
        // Cập nhật lại user có người mình thích
        await User.updateOne({ _id: _id }, { $push: { like: _idother } });
        // Cập nhật lại người được thích được mình thích
        await User.updateOne({ _id: _idother }, { $push: { liked: _id } });
    }
    async handleMatchUser(_id, _idother, liked) {
        // Kiểm tra nếu trong user hiện tại trường _idother có nằm trong trường liked
        if (liked.includes(_idother)) {
            console.log(liked);
            console.log("day la idother" + _idother);
            // Nếu có thêm vào trường match và xóa _idother nằm trong liked
            // Phần người dùng
            await User.updateOne({ _id: _id }, { $pull: { liked: _idother }, $push: { match: _idother } });
            // Phần đối tượng người dùng
            await User.updateOne({ _id: _idother }, { $pull: { liked: _id }, $push: { match: _id } });
            // Tạo 1 conversation cho 2 người dùng nhắn tin với nhau
            const conversation = new Conversation({
                members: [_id, _idother],
            })
            await conversation.save();
            return true;
        }
        return false;
    }
    async sendMessage(message,_id){
        const newMessage = new Message({
            conversation:message.idconversation,
            sender:_id,
            text:message.text
        })
        await newMessage.save();
    }
}
module.exports = new AppSocket();