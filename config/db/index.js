const mongoose = require('mongoose');
async function connect() {
    try{
        await mongoose.connect('mongodb+srv://khoadangatd:0907761216@cluster0.nphsk.mongodb.net/manageYvideo?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
    catch(error){
        console.log("Connect failure!")
    }
}

module.exports = { connect };



