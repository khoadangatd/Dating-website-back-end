const Picture = require("../models/Picture");
const User = require("../models/User");
var fs = require('fs');
var randomstring = require("randomstring");

class pictureController {
    uploadImage(req, res, next) {
        var pp = req.files.image;
        var fileName;
        var name=req.files.image.name;
        console.log(name);
        var tailPic=[".jpeg",".png",".gif",".tiff",".psd",".pdf","eps",".ai","jpg",".raw",".svg"]
        var checkPic=false;
        for(let i=0;i<tailPic.length;i++){
            if(req.files.image.name.toLowerCase().includes(tailPic[i])){
                checkPic=true;
                break;
            }
        }
        if(checkPic){
            fileName = randomstring.generate(15) + '.jpeg';
        }
        else{
            fileName = randomstring.generate(15) + '.mp4';
        }
        pp.mv('public/images/' + fileName, async function (err) {
            if (err) {
                res.json({ message: "Thêm hình ảnh thất bại" })
            }
            else {
                var stt = await Picture.countDocuments({ user: req.user._id });
                var first = false;
                if (stt == 0) {
                    await User.updateOne({ _id: req.user._id, avatar: "avatarDefault.png" }, { avatar: fileName });
                    first = true;
                }
                var picture = new Picture({
                    user: req.user._id,
                    type: stt + 1,
                    src: fileName,
                })
                await picture.save();
                res.status(200).json({
                    message: "Thêm hình ảnh thành công",
                    first,
                })
            }
        })
    }
    getImage(req, res, next) {
        console.log(req.params.iduser);
        Picture.find({ user: req.params.iduser }).sort({ type: 1 })
            .then(pictures => {
                res.json({
                    message: "Hình ảnh của người dùng",
                    data: pictures
                })
            })
            .catch((err) => res.status(500).json(error));
    }
    async deleteImage(req, res, next) {
        try {
            const picture = await Picture.findOne({ _id: req.params.idpic });
            console.log(picture);
            if(picture.user!=req.user._id)
                return res.status(500).json({message:"Bạn không có quyền xóa hình ảnh này"});
            await Picture.updateMany({user:req.user._id,type:{$gt:picture.type}},{$inc:{type:-1}});
            await User.updateOne({_id:req.user._id,avatar:picture.src},{avatar:"avatarDefault.png"});
            await Picture.deleteOne({ _id: req.params.idpic });
            fs.unlinkSync('public/images/' + picture.src);
            return res.status(200).json({ message: "Xóa hình ảnh thành công" })
        }
        catch (err) {
            return res.status(500).json({ message: "Có lỗi cơ sở dữ liệu. Vui lòng truy cập lại sau"})
        }
    }
}

module.exports = new pictureController();