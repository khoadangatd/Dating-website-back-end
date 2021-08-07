const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Phân quyền người dùng thành 3 cấp : 
// 0-Quản trị viên. 
// 1-Người dùng free
// 2-Người dùng đăng ký gói thành viên

const User = new Schema({
    idFace: { type: String },
    role: {type:Number,default:1},
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
    avatar:{type: String,default: "avatarDefault.png"}, //avatar mặc định
    unlike: [String],// Dùng để loại bỏ khi hàm Finduser thực hiện không xuất hiện lại
    like: [String],// Dùng để loại bỏ khi hàm Finduser thực hiện không xuất hiện lại
    match: [String],//Khi người dùng nhấn nút like sẽ kiểm tra trong csdl bảng liked có tồn tại _idother( id của người dùng được nhấn)
    liked: [String],//Dùng để hiển thị trường đã thích bạn và xử lý khi match
    aboutme:{type:String},
    job:{type:String},
    target:{type:String},
    marriage:{type:String},
    height:{type:String},
    smoking:{type:String},
    liquor:{type:String},
    disable: { type: Boolean, default: false },
    credit: { type: Number,default:0},
    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', User)