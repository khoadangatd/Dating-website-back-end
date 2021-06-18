const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInteract = new Schema({
    idFace: { type: String },
    email: { type: String },
    name: { type: String },
    avatar: { type: String },
},
    {
        timestamps: true,
    }
)

const User = new Schema({
    idFace: { type: String },
    email: { type: String },
    name: { type: String },
    gender: { type: String },
    age: { type: Number },
    phone: { type: String },
    city: { type: String },
    password: { type: String },
    authMail: { type: Boolean, default: false },
    setting: {
        age: [Number],
        gender: { type: String },
    },
    avatar:{type: String,default: "https://i.stack.imgur.com/l60Hf.png"}, //avatar mặc định
    unlike: [String],
    like: [String],
    match: [UserInteract],
    liked: [UserInteract],
    aboutme:{type:String},
    job:{type:String},
    target:{type:String},
    marriage:{type:String},
    height:{type:String},
    smoking:{type:String},
    liquor:{type:String},
    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', User)