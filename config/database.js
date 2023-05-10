const mongoose = require('mongoose');
const { DB_URI } = process.env;

module.exports.connect = () => {

    mongoose.connect(DB_URI).then((result)=> {
        console.log('Connected to db');

    }).catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
}