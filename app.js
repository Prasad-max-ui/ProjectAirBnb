if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 8080;




const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection succesfull");
    })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(MONGO_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const sessionOption = {
    secret: "mysupersecrate",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        HttpOnly: true
    }
}




app.get("/", (req, res) => {
    res.send("root path");
})

app.use(session(sessionOption))
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.succesMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



// post review middle ware for listing delete 

// // demo user 
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student",
//     })

//     let regisisterUser = await User.register(fakeUser,"student123")
//     res.send(regisisterUser)
// })


app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.all("/{*any}", (req, res, next) => {
    next(new ExpressError(404, "Page not fount ."))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went worng " } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
})

app.listen(port, () => {
    console.log(`listining on port ${port} ....`)
})

