const User = require("../models/user");

module.exports.renderSignupForm = async (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email,
        })
        let regisisterUser = await User.register(newUser, password)
        console.log(regisisterUser);
        req.login(regisisterUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wander lust");
            res.redirect("/listing");
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to  wanderlust ,you are login ..")
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "successfully logout")
        res.redirect("listing")
    })
}