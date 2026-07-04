const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/user", userAuth, async(req, res)=>{
    try{
        const user = req.user;
        return res.send(user)
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});

profileRouter.patch("/profile/user/:userId", userAuth, async(req,res)=>{
    const userId = req.params.userId;
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
        loggedInUser.save();
        //const user = await User.findByIdAndUpdate({_id:userId},req.body,{returnDocument:"after",runValidators:true});
        return res.json({
            message:loggedInUser.firstName+"'s profile is updated",
            data:loggedInUser
        })
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});

profileRouter.delete("/deleteUser", async(req, res)=>{
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

module.exports = profileRouter;