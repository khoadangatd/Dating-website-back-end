const User = require("../models/User");
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerValidation } = require("../../auth/validation");
dotenv.config();
const tokenList = {};

class userController {
    login(req, res, next) {
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                return res.status(400).json({ message: "Email không tồn tại" });
            }
            if (!Bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json({ message: "Password chưa chính xác" });
            }
            req.body._id = user._id;
            const data = req.body;
            const accessToken = generateAccessToken(data);
            const refreshToken = generateRefreshToken({_id:user._id});

            tokenList[refreshToken] = data;

            res.json({
                message: "Đăng nhập thành công",
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        })
            .catch((error) => res.status(500).json(error));
    }
    refreshToken(req, res, next) {
        const refreshToken  = req.body.refreshToken;
        if(!refreshToken) res.sendStatus(401);   
        if (!(refreshToken in tokenList)) res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err) return res.sendStatus(403);
            const user = tokenList[refreshToken];
            const accessToken = generateAccessToken(user);
            res.status(200).json({
                message: "Mã token mới",
                accessToken: accessToken,
            });
        })
    }
    editSetting(req,res,next){
        User.updateOne({ _id: req.user._id },{setting:{
            gender:req.body.gender,
            age:req.body.age
        }}).then(()=>{
            res.json({
                message:"Cập nhật cài đặt thành công.",
                submessage:"Hãy refresh lại trang"
            })
        }).catch((error) => res.status(500).json({ message: error }));
    }
    editInfo(req,res,next){
        console.log(req.body)
        User.updateOne({ _id: req.user._id },{
            aboutme:req.body.aboutme,
            job:req.body.job,
            target:req.body.target,
            gender:req.body.gender,
            marriage:req.body.marriage,
            height:req.body.height,
            smoking:req.body.smoking,
            liquor:req.body.liquor,
            city:req.body.city,
        }).then(()=>{
            res.json({
                message:"Cập nhật cài đặt thành công.",
                submessage:"Hãy refresh lại trang"
            })
        }).catch((error) => res.status(500).json({ message: error }));
    }
    async register(req, res, next) {
        const { error } = registerValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).json({ message: "Email đã tồn tại" });
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        const formData = req.body;
        const genderSetting = formData.gender == "Nam" ? "Nữ" : "Nam";
        const user = new User({
            ...formData,
            setting: {
                age: [parseInt(formData.age) - 2, parseInt(formData.age) + 2],
                gender: genderSetting,
            },
        });
        user.save()
            .then((data) => {
                res.status(200).json({ message: "Đăng ký thành công" });
            })
            .catch((error) => res.status(500).json({ message: error }));
    }
    // Đợi facebook xác thực
    async loginFB(req, res, next) {
        const formData = req.body;
        const accessToken = generateAccessToken({
            idFace: req.body.idFace,
            name: req.body.name
        });
        const idFace = await User.findOne({ idFace: req.body.idFace });
        if (idFace) {
            res.json({
                message: "Đăng nhập thành công",
                token: accessToken,
                login: true,
            });
        }
        else {
            res.json({
                message: "Đăng ký tài khoản",
                login: false,
            });
        }
    }
    async registerFb(req, res, next) {
        formData = {
            city,
            age,

        }
        const formData = req.body;
    }
    getUser(req, res, next) {
        // getUser về lưu vào redux
        User.findOne({ _id: req.user._id }).then(user => {
            res.status(200).json({ message: "Thông tin người dùng", data: user });
        })
            .catch((error) => res.status(500).json(error));
    }
    // async unLikeUser(req, res, next) {
    //     // body bao gồm req.body ={
    //     //      id: id người dùng,
    //     //      unliked: người dùng không thích,
    //     //      liked:người dùng thích,
    //     // }
    //     User.updateOne({ email: req.user.email },
    //         { $push: { unlike: formData.unlike } },
    //         { $push: { like: formData.like } }
    //     ).then(user => {
    //         res.status(200).json({ message: "Sửa thành công", user: user });
    //     })
    //     User.find({ liked: user.liked })
    // }

    // async getUserLiked(req,res,next){
    //     const user= await User.findOne({$or:[{ email: req.user.email },{ idFace: req.user.idFace }]});
    //     User.find({$or:[{ email:{$in:user.liked} },{ idFace: {$in:user.liked} }]}).then(user => {
    //         res.status(200).json({ message: "Thông tin người dùng đã thích bạn", data: user });
    //     })
    //     .catch((error) => res.status(500).json(error));
    // }

    // async getUserMatch(req,res,next){
    //     const user= await User.findOne({$or:[{ email: req.user.email },{ idFace: req.user.idFace }]});
    //     User.find({$or:[{ email:{$in:user.match} },{ idFace: {$in:user.match} }]}).then(user => {
    //         res.status(200).json({ message: "Thông tin người dùng kết đôi với bạn", data: user });
    //     })
    //     .catch((error) => res.status(500).json(error));
    // }

    async findUser(req, res, next) {
        // Tìm một người nào đó phù hợp nằm trong setting giới hạn 5 người 1 lần get
        const user = req.body;
        const users = await User.find({ age: { $gte: user.setting.age[0], $lte: user.setting.age[1] }, gender: user.setting.gender, email: { $nin: user.unlike, $nin: user.like },_id:{$ne:req.user._id}}).limit(5);
        res.status(200).json({ message: "Thông tin người dùng", data: users });
    }
}

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1000s' });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}


module.exports = new userController();