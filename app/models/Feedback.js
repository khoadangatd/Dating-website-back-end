const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feedback = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        mess: { type: String },
    },
    {
        timestamps: true,
    });

module.exports = mongoose.model('Feedback', Feedback)