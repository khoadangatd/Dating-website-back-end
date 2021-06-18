const Picture = require("../models/Picture");
var path = require('path');
var fs = require('fs');
var randomstring = require("randomstring");

class pictureController {
    uploadImage(req, res, next) {
        console.log(req.body);
        var pp = req.files.image;
        var fileName = randomstring.generate(10) + '.png';
        pp.mv('public/images/' + fileName, async function (err) {
            if (err) {
                res.json({ message: "Thêm hình ảnh thất bại" })
            }
            else {
                var npicture = await Picture.countDocuments({ user: req.user._id });
                npicture = npicture == 0 ? "main" : "sub";
                var picture = new Picture({
                    user: req.user._id,
                    type: npicture,
                    src: fileName,
                })
                picture.save().then(() => {
                    res.status(200).json({ message: "Thêm hình ảnh thành công" })
                })
            }
        })
    }
    getImage(req, res, next) {
        console.log(req.params.iduser);
        Picture.find({ user: req.params.iduser })
            .then(pictures => {
                res.json({
                    message: "Hình ảnh của người dùng",
                    data: pictures
                })
            })
            .catch((err) => res.status(500).json(error));
    }
}

module.exports = new pictureController();