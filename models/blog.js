const mongoose = require('mongoose');
// define the structure of the document that will be stored inside the collection at mongodb
// model will wraps around the schema to comunicate with the database
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type : String,
        required : true
    }, 
    snippet: {
        type : String,
        required : true
    }, 
    body: {
        type: String,
        required: true
    }
}, {timestamps: true});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
