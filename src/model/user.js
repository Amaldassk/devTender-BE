const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate:{
            validator:(email)=>{
                return validator.isEmail(email)
            },
            message:"Invalid email address!!"
        }
    },
    password:{
        type:String,
        required: true,
        validate:{
            validator:(password)=>{
                return validator.isStrongPassword(password)
            },
            message:"Enter a strong password"
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"/user-profile.png"
    },
    skills:{
        type:[String],
        validate:{
            validator:value => value.length<=5,
            message:"A maximum of 5 skills is allowed"
        },
    }
},{
    timestamps:true
});

userSchema.methods.getJWT = function(){
    const user = this;
    return jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
}

userSchema.methods.validatePassword = function(passwordInputByUser){
    const user = this;
    return bcrypt.compare(passwordInputByUser,user.password);
}

module.exports = mongoose.model("User",userSchema);