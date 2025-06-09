const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const {validateUser,createTokenForUser} = require('../services/authentication');
const { error } = require('console');

const userSchema = new Schema({
    fullName : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default: '/images/default.png'
    },
    role:{
        type:String,
        enum : ["ADMIN","USER"],
        default:'USER'
    }
},{timestamps: true})

userSchema.pre('save',function(next){
    const user = this;

    if(!user.isModified("password")) return ;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});


userSchema.static("matchPasswordAndGenerateToken",async function (email,password){
    const user = await User.findOne({email});
    if(!user) return false;

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac('sha256',salt).update(password).digest("hex");

    if(hashedPassword !== userProvidedPassword){
        throw new Error("incorrect password");
    }
    const token = createTokenForUser(user);
    
    console.log(token);

    return token;
})

const User = model('user',userSchema);

module.exports = User;