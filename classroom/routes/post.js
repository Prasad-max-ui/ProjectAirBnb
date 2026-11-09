const express = require("express");
const router = express.Router();

// index -posts
router.get("/",(req,res)=>{
    res.send("Get for posts ")
})

// show -posts
router.get("/:id",(req,res)=>{
    res.send("Get for post id ")
})

// post -posts
router.post("/",(req,res)=>{
    res.send("post for posts ")
})

// delete -posts
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id ")
})

module.exports = router;