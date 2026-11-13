const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js")
const { valadatereview, isLoggedIn, isAuthor } = require("../middleware.js")
const reviewControllers = require("../controllers/reviews.js")





// review section 
//post review route
router.post("/", isLoggedIn, valadatereview, wrapAsync(reviewControllers.createReview))

// delete route for review 
router.delete("/:reviewid", isLoggedIn, isAuthor, wrapAsync(reviewControllers.destroyReview));


module.exports = router;
