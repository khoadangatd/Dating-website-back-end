const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    type:{type:String},
    quantity:{type:Number},
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', Notification)