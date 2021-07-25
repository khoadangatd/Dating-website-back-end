const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    type:{type:String},
    
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', Notification)