const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    text:{
        type:String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', Message)