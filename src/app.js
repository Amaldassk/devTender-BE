const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDatabase = require("./config/database");
const User = require("./model/user");
const {validateSignUpData} = require("./utils/validate");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/", requestRouter);

connectDatabase()
    .then(()=>{
        console.log("Database conection established...");
        app.listen(3000,()=>{
            console.log("server listening successfully in port 3000");
        });
    })
    .catch(()=>console.error("Database is not connected!!"));
