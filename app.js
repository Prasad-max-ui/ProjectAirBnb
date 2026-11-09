const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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





// post review middle ware for listing delete 


app.get("/", (req, res) => {
    res.send("root path");
})

app.use("/listing",listings);

app.use("/listing/:id/reviews",reviews);


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

