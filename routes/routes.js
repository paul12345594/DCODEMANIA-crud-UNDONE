const express = require("express");
const router = express.Router();
const User = require ("../models/users");
const multer = require("multer");

//IMAGE UPLOAD
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
    cb(null, file.fieldname +"_"+ Date.now +"_"+ file.originalname);
    },
});
//middle ware
var upload = multer({
    storage:storage,
}).single('image');

//URL
router.get("/", (req, res) => {
    res.render("index", { title: "Home Page" })    // CONNECTED TO HTML 
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: "Add Users" });    // CONNECTED TO THE add_users.ejs
})

module.exports = router;


