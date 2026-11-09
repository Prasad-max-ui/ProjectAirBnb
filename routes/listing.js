const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const listingSchema = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")

const valadatelisting = (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}




// index route 
router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });

}))


// new route 
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})


// show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}))

// create route 
router.post("/", valadatelisting, wrapAsync(async (req, res, next) => {
    const newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        image: {
            url: image
        }
    })
    await newListing.save();
    console.log("data add complected");

    res.redirect("listing");

}))


// update route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

router.put("/:id", valadatelisting, wrapAsync(async (req, res) => {
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

    console.log(updatedListing);
    res.redirect(`/listing/${id}`);
}))


// destroy route 

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listing");
}))


module.exports = router;
