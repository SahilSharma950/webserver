const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required:true,
    },
    author : {
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    categories:{
        type:[String],
        required:true
    }    
})

const Blog = mongoose.model("blog",blogSchema)

module.exports = Blog