const {Router} = require('express');
const router = Router();
const User = require("../models/user");
const multer = require("multer");
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comments');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.resolve('./public/uploads'));
    },
    filename : function(req,file,cb){
        const fileName = `${Date.now()}- ${file.originalname}`
        cb(null,fileName);
    }
})

const upload = multer({storage:storage});

router.get('/add-new',async (req,res)=>{
    const user = await User.findOne({email : req.user.email});
    return res.render("addBlog",{
        user 
    });
});

router.get('/all-blog',async (req,res)=>{
    const user = await User.findOne({email : req.user.email});

    const Blogs = await Blog.find({});

    return res.render("allBlogs",{
        user ,Blogs
    });
});

router.get('/all-blog/search',async (req,res)=>{
    const user = await User.findOne({email : req.user.email});
    const query = req.query.q;
    console.log(query);
    if(!query){
        return res.render("allBlogs",{
            user
        })
    }
    const Blogs = await Blog.find({title : {$regex : query, $options : 'i'}});

    return res.render("allBlogs",{
        user ,Blogs
    });
});

router.get('/delete/:blogid',async (req,res)=>{
    const blogId = req.params.blogid;
    await Blog.deleteOne({_id : blogId});
    return res.redirect('/blog/my-blog');
})

router.get('/my-blog',async (req,res)=>{
    const user = await User.findOne({email : req.user.email});

    const Blogs = await Blog.find({createdBy : user._id});

    return res.render("myBlogs",{
        user ,Blogs
    });
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,content} = req.body;
    const blog = await Blog.create({
        title : title,
        body : content,
        createdBy : req.user._id,
        coverImage:`uploads/${req.file.filename}`

    })
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:blogid',async (req,res)=>{
    const blogid = req.params.blogid;
    const blog = await Blog.findOne({_id : blogid}).populate("createdBy");
    console.log(blog.coverImage);
    const user = await User.findOne({email : req.user.email});

    const allComments = await Comment.find({blogId:blogid}).populate("createdBy");

    return res.render("blogView",{
        user,
        blog,
        allComments
    })

});

router.post('/comment/:blogid',async (req,res)=>{

        const user = await User.findOne({email : req.user.email});
        console.log(req);
        const {content} = req.body;
        
        const comment = await Comment.create({
            body : content,
            createdBy : req.user._id,
            blogId:req.params.blogid,
        })

        return res.redirect(`/blog/${req.params.blogid}`);
})

router.get('/update/:blogid',async(req,res)=>{
    const user = await User.findOne({email : req.user.email});
    const blogid = req.params.blogid;
    return res.render("updateBlog",{
            user,blogid
     });

})

router.post('/update/:blogid',upload.single('coverImage'),async (req,res)=>{
    const user = await User.findOne({email : req.user.email});
    const blogid = req.params.blogid;
    const {title,content} = req.body;
    const coverImage = req.file.filename;
    const updatedBlog = await Blog.findByIdAndUpdate(blogid,{
        title,
        body : content,
        coverImage : `uploads/${coverImage}`,
    });

    console.log(updatedBlog);

    return res.redirect(`/blog/${req.params.blogid}`);

})

module.exports = router;