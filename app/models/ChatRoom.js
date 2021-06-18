const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoom = new Schema({
    member:[String],
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ChatRoom', ChatRoom)