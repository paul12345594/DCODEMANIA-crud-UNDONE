const express = require("express");
const router = express.Router();
const User = require ("../models/users");
const multer = require("multer");   // For uploading image 
const fs = require ("fs")





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
router.post("/update/:id", upload, async (req, res) => {
   }
);

// Update User Route
router.put("/update/:id", upload, async (req, res) => {
    let id = req.params.id;
    let new_image = "";

    // Check if a new image was uploaded
    if (req.file) {
        new_image = req.file.filename;  // Assign the new image filename

        // Check if the old image is passed in the request body
        const oldImageName = req.body.old_image;
        console.log("Old image passed: ", oldImageName); // Log the value of old_image

        // Try to delete the old image if it e.ists
        try {
            if (oldImageName) {
                const oldImagePath = "./uploads/" + oldImageName;
                console.log('Attempting to delete old image:', oldImagePath);  // Log the old image path
                
                // Check if the old image exists before trying to delete it
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Remove the old image from the 'uploads' folder
                    console.log('Old image deleted successfully.');
                } else {
                    console.log('Old image not found:', oldImagePath);  // Log if the file doesn't exist
                }
            } else {
                console.log("No old image provided, skipping deletion.");
            }
        } catch (err) {
            console.log("Error deleting old image: ", err);
        }
    } else {
        new_image = req.body.old_image; // If no new image is uploaded, keep the old one
    }

    // Prepare the update data
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        photo: new_image, // Use the new or old image filename
    };

    try {
        // Update the user in the database
        const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };

        res.redirect("/");  // Redirect to the home page

    } catch (err) {
        console.log(err); // Log the error
        res.json({ message: err.message, type: 'danger' }); // Respond with error message
    }
});


// DELETE USER ROUTE
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id, (err, result) => {
        if (err) {
            return res.json({ message: err.message });
        }

        if (result) {
            if (result.photo != '') {  // Correctly check for the photo field
                try {
                    fs.unlinkSync('./uploads/' + result.photo);  // Delete the photo file
                } catch (err) {
                    console.log('Error deleting image: ', err);
                }
            }

            req.session.message = {
                type: 'INFO',
                message: 'User deleted successfully!',
            };
            return res.redirect('/');
        } else {
            return res.json({ message: 'User not found!' });
        }
    });
});


module.exports = router;  









