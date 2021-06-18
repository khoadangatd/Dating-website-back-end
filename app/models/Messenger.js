const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messenger = new Schema({
    chatroom:{
        type:mongoose.Schema.Types.ObjectId(),
        required,
        ref:"Chatroom",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId(),
        required,
        ref:"User",
    },
    message:{
        type:String,
        required,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Messenger', Messenger)