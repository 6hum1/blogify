const {Router} = require('express');
const router = Router();
const User = require("../models/user");
const Blog = require("../models/blog")


router.get('/',async (req,res)=>{

   try{
        const allBlogs = await Blog.find({});
        const user = await User.findOne({email : req.user.email});
        return res.render("home",{
            user,allBlogs
        });
   }catch(err){
        return res.render("home");
   }
});


router.get('/signup',(req,res)=>{
    return res.render('signup');
});

router.get('/signin',(req,res)=>{
    return res.render('signin');
});


module.exports = router;