const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.post('/signup',async (req,res) =>{
    const {fullName,email,password} = req.body;
    // console.log(req.body);

    if(!fullName || !email || !password){
        return res.redirect('/signup');
    }

    const user = await User.create({
        fullName,
        email,
        password,
    });

    // console.log(user);
    return res.redirect('/');
});

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    
    try{
        // console.log(req.user);
        const token = await User.matchPasswordAndGenerateToken(email,password);

        // console.log(token);
        return res.cookie('token',token).redirect('/');
    }catch(Err){
        return res.render('signin',{
            error : "incorrect password or email",
        })
    }
});

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
});


module.exports = router;