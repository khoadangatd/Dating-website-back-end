const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const Deal = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mess: { type: String },
    money:{type:Number},
    status:{type:Boolean,default:false},
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Deal', Deal)