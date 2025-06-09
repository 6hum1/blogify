const {Schema,model, default: mongoose} = require('mongoose');

const commentSchema = new Schema({
    body : {
        type : String,
        required:true,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required:true,
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : "blog",
        required:true,

    }


},{timestamps:true});

const Comment = model("comment",commentSchema);

module.exports = Comment;
