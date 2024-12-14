const express = require("express");
const router = express.Router();
const User = require ("../models/users");
const multer = require("multer");   // For uploading image 
const fs = require ("fs");



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




// GET AN USER ROUTE 
router.get('/edit/:id', async (req, res) => { // Make the route handler async
    const id = req.params.id;

    try {
        const user = await User.findById(id); // Use await for asynchronous operation
        if (!user) {
            return res.redirect("/"); // If user is not found, redirect
        }
        res.render("edit_users", {
            title: "Edit User",
            user: user, // Pass the user to the template
        });
    } catch (err) {
        console.error(err); // Log error
        res.redirect("/"); // Redirect if an error occurs
    }
});


// Update User Route
router.post('/update/:id', async (req, res) => {
    let id = req.params.id;
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;
        try {
            // Delete the old image
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        // Use async/await for findByIdAndUpdate
        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        }, { new: true }); // The `{ new: true }` option returns the updated document

        // Send success message
        req.session.message = {
            type: "Success",
            message: "User updated successfully!"
        };

        // Redirect to the user's edit page to see the updated data
        res.redirect(`/edit/${id}`);

    } catch (err) {
        // If there is an error, handle it
        res.json({ message: err.message, type: "danger" });
    }
});


module.exports = router;





