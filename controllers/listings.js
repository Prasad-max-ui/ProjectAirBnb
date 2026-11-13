const Listing = require("../models/listing.js")

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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "....", filename);

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

    await newListing.save();

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
    res.render("listings/edit.ejs", { listing });
}


module.exports.updateListing = async (req, res) => {
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
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(delListing);
    res.redirect("/listing");
}