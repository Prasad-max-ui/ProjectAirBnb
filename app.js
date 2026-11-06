const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);





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
app.get("/listing", async (req, res) => {
    let allListing = await Listing.find();
    res.render("listings/index.ejs", { allListing });

})


// new route 
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})


// show route 
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})

// create route 
app.post("/listing", async (req, res) => {
    let { title, description, price, location, country, image } = req.body;
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

})


// update route 
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

app.put("/listing/:id", async (req, res) => {
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
})


// destroy route 

app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listing");
})


app.listen(port, () => {
    console.log(`listining on port ${port} ....`)
})

