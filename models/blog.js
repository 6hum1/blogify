const {Schema,model, default: mongoose} = require('mongoose');

const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true,
    },
    coverImage : {
        type : String,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }

},{timestamps:true});

blogSchema.index({title : 'text'});

const Blog = model("blog",blogSchema);


module.exports = Blog;
