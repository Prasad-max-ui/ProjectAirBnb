const express = require("express");
const router = express.Router();

// index -user
router.get("/",(req,res)=>{
    res.send("Get for users ")
})

// show -user
router.get("/:id",(req,res)=>{
    res.send("Get for user id ")
})

// post -user
router.post("/",(req,res)=>{
    res.send("post for users ")
})

// delete -user
router.delete("/:id",(req,res)=>{
    res.send("Delete for user id ")
})

module.exports = router;