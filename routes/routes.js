const express = require("express");
const router = express.Router();
const User = require ("../models/users");
const multer = require("multer");   // For uploading image 

//IMAGE UPLOAD
var storage = multer.diskStorage({
    destination: function(req, file, cb){           // req, files, cb = arguments 
        cb(null, './uploads');          // HERE WHERE THE IMAGE UPLOADED
    },      
    filename: function(req, file, cb){
        cb(null, file.fieldname +"_"+ Date.now() +"_"+ file.originalname);
    }
})

// LIGHT MIDDLEWARE
var upload = multer({
    storage: storage,
}).single("image")


// INSERT AN USER INTO DATABASE ROUTE
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });    // CONNECTED TO THE add_users.ejs
})
// Insert an user into the database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            photo: req.file.filename,
        });

        // Use async/await with save()
        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };

        res.redirect("/");

    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//URL
// Get all users ROUTE
router.get("/", async (req, res) => {
    try {
        // Wait for the result of the query
        const users = await User.find().exec();  // or just User.find() without exec(), both work
        res.render("index", {
            title: "Home Page",  // Title for the page
            users: users,        // Pass the users data to the view
        });
    } catch (err) {
        // If an error occurs, send a JSON response with the error message
        res.json({ message: err.message });
    }
});



module.exports = router;






