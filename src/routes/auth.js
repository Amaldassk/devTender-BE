const express = require("express");
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../utils/validate");
const User = require("../model/user");

const authRouter = express.Router();

authRouter.post("/signup", async(req, res)=>{
    try{
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHashed = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHashed
        });
        await user.save();
        res.send("User added successfully");
    } catch(err){
        res.status(400).send("Error : "+err.message)
    }
});

authRouter.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials!!");
        }

        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            const token = user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),httpOnly:true});
            res.send("Login Successfull")
        } else {
            throw new Error("Invalid Credentials!!");
        }

    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
});

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    }).send("Logout successfull");
});

module.exports = authRouter;