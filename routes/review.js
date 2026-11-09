const express = require("express");
const router = express.Router({mergeParams : true});

const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const reviewSchema = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")



const valadatereview = (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}



// review section 
//post review route
router.post("/", valadatereview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${req.params.id}`)
}))

// delete route for review 
router.delete("/:reviewid",wrapAsync(async (req,res)=>{
    let {id , reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listing/${id}`);
}))


module.exports = router;
