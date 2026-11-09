const express = require("express");
const mongoose = require("mongoose");
const users  = require("./routes/user")
const posts  = require("./routes/post")
const cookieParser = require("cookie-parser");



const app = express();

app.use(cookieParser("secratecode"))

app.get("/getsingedcookies",(req,res)=>{
    res.cookie("made-in","india",{signed : true});
    res.send("singedd cookes send")
})

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("ok")
})

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hellow");
    res.cookie("tata","bye");
    res.cookie("name","babu");
    res.send("this is cookies page")
})

app.get("/greet",(req,res)=>{
    let {name = " anoyomus" }= req.cookies;
    res.send(`hi ${name}`);
})

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("i am root ")
})


app.use("/users" ,users);
app.use("/posts" ,posts);

app.listen(3000 , ()=>{
    console.log("Server is listing on port 3000 ...")
}) 