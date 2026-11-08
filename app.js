const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./schema.js")
const reviewSchema = require("./schema.js")

const app = express();
const port = 8080;




const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection succesfull");
    })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(MONGO_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const valadatelisting = (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}

const valadatereview = (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next()
    }
}

// post review middle ware for listing delete 




app.get("/", (req, res) => {
    res.send("root path");
})

// app.get("/testlisting",(req,res)=>{
//     let sampleListing = new Listing({
//         title: "my new vila 2",
//         description : "it is my new vila where i lived in tommorow onwards ",
//         price : 42000,
//         location : "calangute ,goa",
//         country: "India"
//     })
//     sampleListing.save()
//         .then((result)=>{
//             console.log(result)
//         })
//         .catch(err => console.log(err))

//     res.send("added data...")
// })

// index route 
app.get("/listing", wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });

}))


// new route 
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})


// show route 
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}))

// create route 
app.post("/listing", valadatelisting, wrapAsync(async (req, res, next) => {
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
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

app.put("/listing/:id", valadatelisting, wrapAsync(async (req, res) => {
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

app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listing");
}))





// review section 
//post review route
app.post("/listing/:id/reviews", valadatereview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${req.params.id}`)
}))

// delete route for review 
app.delete("/listing/:id/reviews/:reviewid",wrapAsync(async (req,res)=>{
    let {id , reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listing/${id}`);
}))


app.all("/{*any}", (req, res, next) => {
    next(new ExpressError(404, "Page not fount ."))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went worng " } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
})

app.listen(port, () => {
    console.log(`listining on port ${port} ....`)
})

