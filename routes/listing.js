const express = require("express");
const router = express.Router();

const multer = require("multer")
const { storage } = require("../cloudConfig.js")

const upload = multer({ storage })


const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, valadatelisting } = require("../middleware.js")

const listingController = require("../controllers/listings.js")




// new route 
router.route("/new")
    .get(isLoggedIn, listingController.renderNewForm)



// index route  and create route 
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("image"), valadatelisting, wrapAsync(listingController.createListing));

//  show route ,update route ,  destroy route 
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, valadatelisting, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



// update route 
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))




module.exports = router;
