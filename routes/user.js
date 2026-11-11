const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();

router.get("/signup", async (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email,
        })
        let regisisterUser = await User.register(newUser, password)
        console.log(regisisterUser);
        req.flash("success", "Welcome to wander lust");
        res.redirect("/listing");
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}))


router.get("/login", async (req, res) => {
    res.render("users/login.ejs");
})



router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success","Welcome back to  wanderlust ,you are login ..")
    res.redirect("/listing")
})









module.exports = router;