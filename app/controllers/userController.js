const User = require("../models/User");
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerValidation } = require("../../auth/RegisterValidation");
const { privateValidation } = require("../../auth/PrivateValidation");
const { $where } = require("../models/User");
const Deal = require("../models/Deal");
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
            if (user.disable == true) {
                return res.status(400).json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });
            }
            // if(user.authMail==false){
            //     return res.status(400).json({ message: "Tài khoản chưa xác thực hãy truy cập gmail của bạn" });
            // }
            const data = {
                email: user.email,
                _id: user._id,//thêm id vào token
                match: user.match,// thêm id match với người dùng
                liked: user.liked,// thêm id liked với người dùng
                role: user.role//Thêm quyền của người dùng
            };
            const accessToken = generateAccessToken(data);
            const refreshToken = generateRefreshToken({ _id: user._id });

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
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) res.sendStatus(401);
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
    editSetting(req, res, next) {
        User.updateOne({ _id: req.user._id }, {
            setting: {
                gender: req.body.gender,
                age: req.body.age
            }
        }).then(() => {
            res.json({
                message: "Cập nhật cài đặt thành công.",
                submessage: "Hãy refresh lại trang"
            })
        }).catch((error) => res.status(500).json({ message: error }));
    }
    editInfo(req, res, next) {
        console.log(req.body)
        User.updateOne({ _id: req.user._id }, {
            aboutme: req.body.aboutme,
            job: req.body.job,
            target: req.body.target,
            gender: req.body.gender,
            marriage: req.body.marriage,
            height: req.body.height,
            smoking: req.body.smoking,
            liquor: req.body.liquor,
            city: req.body.city,
        }).then(() => {
            res.json({
                message: "Cập nhật cài đặt thành công."
            })
        }).catch((error) => res.status(500).json({ message: error }));
    }

    async editPrivate(req, res) {
        console.log(req.body);
        const { error } = privateValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        try {
            const check = await User.findOne({ _id: req.user._id });
            req.body.password = Bcrypt.hashSync(req.body.password, 10);
            if (!Bcrypt.compareSync(req.body.passwordold, check.password)) {
                return res.status(400).json({ message: "Bạn nhập sai mật khẩu cũ" });
            }
            else {
                await User.updateOne({ _id: req.user._id }, {
                    name: req.body.name,
                    gender: req.body.gender,
                    age: req.body.age,
                    phone: req.body.phone,
                    password: req.body.password
                })
                res.json({
                    message: "Cập nhật cài đặt thành công."
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error })
        }
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
    // Thông tin tài khoản đăng nhập
    getUser(req, res, next) {
        // getUser về lưu vào redux
        User.findOne({ _id: req.user._id }).then(user => {
            res.status(200).json({ message: "Thông tin người dùng", data: user });
        })
            .catch((error) => res.status(500).json(error));
    }
    // Thông tin tài khoản khách
    getOther(req, res, next) {
        // getUser về lưu vào redux
        const { _id } = req.params;
        User.findOne({ _id: _id }, '_id name gender avatar age aboutme job target marriage height smoking liquor city')
            .then(user => {
                console.log(user);
                res.status(200).json({ message: "Thông tin người dùng", data: user });
            })
            .catch((error) => res.status(500).json(error));
    }

    async findUser(req, res, next) {
        // Tìm một người nào đó phù hợp nằm trong setting giới hạn 5 người 1 lần get
        const user = req.body;
        try {
            const users = await User.find
                ({
                    age: {
                        $gte: user.setting.age[0], $lte: user.setting.age[1]
                    },
                    gender: user.setting.gender,
                    _id: {
                        $nin: user.unlike, $nin: user.like, $ne: req.user._id
                    }
                }, '_id name gender avatar age aboutme job target marriage height smoking liquor city')
                .limit(5);
            res.status(200).json({ message: "Thông tin người dùng", data: users });
        }
        catch (error) {
            res.status(500).json(error)
        }
    }

    // Phương thức dùng để render ra 2 trang Match và Liked ở client
    async findUserMatch(req, res, next) {
        try {
            // Lấy dữ liệu match với người dùng
            const matchers = await User.find({ _id: { $in: req.body.match } });
            res.status(200).json({ message: "Thông tin người dùng kết đôi", data: matchers });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

    async findUserLiked(req, res, next) {
        try {
            // Lấy dữ liệu liked với người dùng
            const likers = await User.find({ _id: { $in: req.body.liked } });
            res.status(200).json({ message: "Thông tin người dùng đã thích bạn", data: likers });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

    // ADMIN
    async getAllUser(req, res, next) {
        if (req.user.role != 0) return res.status(403).json({ message: "Bạn không có quyền truy cập" })
        var { page, search } = req.query;
        console.log(page, search);
        const itemInPage = 6;
        try {
            var totalItem = search ?
                await User.countDocuments({ name: { $regex: '.*' + search + '.*' } }) :
                await User.countDocuments();
            search = search || "";
            var totalPage = Math.ceil((totalItem * 1.0) / itemInPage);
            console.log(totalPage);
            const user = await User.find({ name: { $regex: '.*' + search + '.*' } })
                .skip(itemInPage * (page * 1.0 - 1))
                .limit(itemInPage);
            console.log(user);
            res.status(200).json({
                message: "Thông tin người dùng ", data: user,
                page,
                search,
                itemInPage,
                totalPage,
            });
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    async diableUser(req, res, next) {
        if (req.user.role != 0) return res.status(403).json({ message: "Bạn không có quyền truy cập" })
        var { id, disable } = req.body;
        try {
            await User.updateOne({ _id: id }, { disable: disable });
            res.status(200).json({
                message: "Vô hiệu hóa thành công"
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    async getUserRegisterbyMonth(req, res) {
        try {
            const totalRes = User.aggregate([
                {
                    $match: {
                        role: { $ne: 0 },
                        createdAt: {
                            $gte: new Date(parseInt(req.params.year), 1, 1),
                            $lt: new Date(parseInt(req.params.year), 12, 30)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt",
                            }
                        },
                        register: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project:
                    {
                        _id: 0,
                        month: "$_id.month",
                        register: "$register",
                    }
                }
            ])
            var ResbyMonth = await totalRes.exec();
            var total = await User.countDocuments({
                createdAt: {
                    $gte: new Date(parseInt(req.params.year), 1, 1),
                    $lt: new Date(parseInt(req.params.year), 12, 30)
                }
            });
            res.status(200).json({
                total: total,
                ResbyMonth
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    async getUserDetailbyMonth(req, res) {
        try {
            const totalResFree = User.aggregate([
                {
                    $match: {
                        role: 1,
                        createdAt: {
                            $gte: new Date(parseInt(req.params.year), 1, 1),
                            $lt: new Date(parseInt(req.params.year), 12, 30)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt",
                            }
                        },
                        register: { $sum: 1 }
                    },
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project:
                    {
                        _id: 0,
                        month: "$_id.month",
                        registerFree: "$register",
                    }
                }
            ])
            const totalResPre = User.aggregate([
                {
                    $match: {
                        role: 2,
                        createdAt: {
                            $gte: new Date(parseInt(req.params.year), 1, 1),
                            $lt: new Date(parseInt(req.params.year), 12, 30)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt",
                            }
                        },
                        register: { $sum: 1 }
                    },
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project:
                    {
                        _id: 0,
                        month: "$_id.month",
                        registerPremium: "$register",
                    }
                }
            ])
            var UserFrees = await totalResFree.exec();
            var UserPres = await totalResPre.exec();
            var totalUserFrees = await User.countDocuments({
                role: 1,
                createdAt: {
                    $gte: new Date(parseInt(req.params.year), 1, 1),
                    $lt: new Date(parseInt(req.params.year), 12, 30)
                }
            });
            var totalUserPres = await User.countDocuments({
                role: 2,
                createdAt: {
                    $gte: new Date(parseInt(req.params.year), 1, 1),
                    $lt: new Date(parseInt(req.params.year), 12, 30)
                }
            });
            res.status(200).json({
                totalUserFrees,
                totalUserPres,
                UserFrees,
                UserPres,
            })
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    async upgradePremium(req, res) {

    }
}

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1000s' });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}


module.exports = new userController();