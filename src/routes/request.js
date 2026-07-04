const express = require("express");

const requestRouter = express.Router();

requestRouter.get("/users", async(req, res)=>{
    try{
        const users = await User.find({});
        return res.send(users);
    } catch(err){
        return res.status(400).send("Something went wrong"+err.message)
    }
});

module.exports = requestRouter;