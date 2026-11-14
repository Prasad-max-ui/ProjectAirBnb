const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")

}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "listing Not found");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res) => {
    let responce = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const { title, description, price, location, country } = req.body;

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: {
            filename: req.file.filename,
            url: req.file.path
        }
    });
    newListing.owner = req.user._id;
    newListing.geometry  = responce.body.features[0].geometry;

    let saveedlisting = await newListing.save();
    console.log(saveedlisting)

    req.flash("success", "New listing created");

    res.redirect("/listing");

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing Not found");
        return res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, country, location } = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
            price: price,
            country: country,
            location: location
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (typeof req.file !== "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Listing Updated");


    console.log(updatedListing);
    res.redirect(`/listing/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(delListing);
    res.redirect("/listing");
}