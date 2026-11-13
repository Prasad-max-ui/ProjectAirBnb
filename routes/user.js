const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");
const userControllers = require("../controllers/users.js")

// sign up  form and signup 
router.route("/signup")
    .get(wrapAsync(userControllers.renderSignupForm))
    .post(wrapAsync(userControllers.signUp))

// login form  and login
router.route("/login")
    .get(wrapAsync(userControllers.renderLoginForm))
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userControllers.login))

// logout 
router.get("/logout", userControllers.logout)




module.exports = router;