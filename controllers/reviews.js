const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.reviews)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created");
    res.redirect(`/listing/${req.params.id}`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}`);
}