const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be login to create listing ..")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the listing")
        return res.redirect(`/listing/${id}`)
    }
    next();
})
module.exports.isAuthor = wrapAsync(async (req,res,next)=>{
    let { reviewid  } = req.params;
    let review = await Review.findById(reviewid );
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the auther of the review")
        return res.redirect(`/listing/${id}`)
    }
    next();
})


module.exports.valadatelisting = (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}

module.exports.valadatereview = (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}
