const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, valadatelisting } = require("../middleware.js")






// index route 
router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });

}))


// new route 
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")

})


// show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "listing Not found");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}))

// create route 
router.post("/", valadatelisting, isLoggedIn, wrapAsync(async (req, res) => {

    const { title, description, price, location, country, image } = req.body;

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: {
            url: image
        }
    });
    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New listing created");

    res.redirect("/listing");

}));


// update route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing Not found");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
}))

router.put("/:id", valadatelisting, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, price } = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
            price: price
        },
        {
            new: true,
            runValidators: true
        }
    );

    req.flash("success", "Listing Updated");


    console.log(updatedListing);
    res.redirect(`/listing/${id}`);
}))


// destroy route 

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(delListing);
    res.redirect("/listing");
}))


module.exports = router;
