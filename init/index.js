const mongoose = require("mongoose");
const initdata = require("./data")
const Listing = require("../models/listing.js")


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


const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6af41a5d6b467be04ca6d501" }))
    await Listing.insertMany(initdata.data);
    console.log("Data was initilize ")
}

initDB();