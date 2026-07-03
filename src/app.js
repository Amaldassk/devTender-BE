const express = require("express");

const app = express();

app.use((req,res)=>{
    res.send("Hello Amal!!")
});

app.listen(3000,()=>{
    console.log("server listening successfully in port 3000");
});