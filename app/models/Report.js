const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reason: {
            type: String
        },
        detail: {
            type: String
        }
    },
    {
        timestamps: true,
    });

module.exports = mongoose.model('Report', Report)