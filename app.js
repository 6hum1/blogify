require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const userRoute = require('./routes/user');
const authRoute = require('./routes/authHandle');
const blogRoute = require('./routes/blog');


const {checkForAuthenticationCookie} = require('./middlewares/authentication')

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then((s)=> console.log("mongodb connected")).catch((err)=> console.log("error connecting mongodb",err));

app.set("view engine","ejs");
app.set('views',path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")))


app.use(checkForAuthenticationCookie("token"));

app.use('/',userRoute);
app.use('/user',authRoute);
app.use('/blog',blogRoute);


app.listen(PORT,()=>{console.log(`server is running on port`)});