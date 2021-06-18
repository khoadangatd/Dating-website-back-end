const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Picture = new Schema(
    {
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        type: { type: String },
        src: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Picture', Picture)