const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDatabase = require("./config/database");
const User = require("./model/user");
const {validateSignUpData} = require("./utils/validate");
const {userAuth} = require("./middlewares/auth")
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req, res)=>{
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

app.post("/login", async(req, res)=>{
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
        res.status(400).send("Error : "+err.message)
    }
});

app.get("/users", async(req, res)=>{
    try{
        const users = await User.find({});
        return res.send(users);
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});


app.get("/user", userAuth, async(req, res)=>{
    try{
        const user = req.user;
        return res.send(user)
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});

app.delete("/deleteUser", async(req, res)=>{
    try{
        const {userId} = req.query;
        if(!userId){
            return res.status(400).send("userId query parameter is required");
        }
        const user = await User.findByIdAndDelete(req.query.userId);
        if(!user){
            return res.status(400).send("Cannot find user")
        }
        return res.send("Usewr deleted successfully");
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});

app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params.userId;
    console.log(userId,"userId")
    try{
        const ALLOWED_UPDATES = ["photoUrl","gender","skills"];

        const isUpdateAllowed = Object.keys(req.body).every(k=>ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate({_id:userId},req.body,{returnDocument:"after",runValidators:true});
        return res.send(user)
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
})

connectDatabase()
    .then(()=>{
        console.log("Database conection established...");
        app.listen(3000,()=>{
            console.log("server listening successfully in port 3000");
        });
    })
    .catch(()=>console.error("Database is not connected!!"));
