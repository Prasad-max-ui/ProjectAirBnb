const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/user")
const posts = require("./routes/post")
const cookieParser = require("cookie-parser");
const Session = require("express-session");
const flash = require("connect-flash")
const path = require("path")


const app = express();

const sessionOption = {
    secret: "mysupersecretekey",
    resave: false,
    saveUninitialized: true
};


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(Session(sessionOption))
app.use(flash());



// app.use(cookieParser("secratecode"))

// app.get("/getsingedcookies",(req,res)=>{
//     res.cookie("made-in","india",{signed : true});
//     res.send("singedd cookes send")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("ok")
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hellow");
//     res.cookie("tata","bye");
//     res.cookie("name","babu");
//     res.send("this is cookies page")
// })

// app.get("/greet",(req,res)=>{
//     let {name = " anoyomus" }= req.cookies;
//     res.send(`hi ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("i am root ")
// })


// app.use("/users" ,users);
// app.use("/posts" ,posts);


// session 

app.use((req,res,next)=>{
    res.locals.sucessmsg = req.flash("sucess")
    res.locals.errormsg = req.flash("error")
    next();
})



app.get("/resister", (req, res) => {
    let { name = "anoyamus" } = req.query;
    req.session.name = name;
    console.log(req.session)
    if (name === "anoyamus") {
        req.flash("error", "some error ocuure");
    } else {
        req.flash("sucess", "user register sucefully");
    }
    res.redirect("/hello");
})


app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
})



// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`)
// })


// app.get("/test",(req,res)=>{
//     res.send("test sucefful")
// })

app.listen(3000, () => {
    console.log("Server is listing on port 3000 ...")
}) 