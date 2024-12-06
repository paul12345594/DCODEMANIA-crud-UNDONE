const express = require("express");
const router = express.Router();

//URL
router.get("/", (req, res) => {
    res.render("index", { title: "Home Page" })    // CONNECTED TO HTML 
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: "Add Users" });    // CONNECTED TO THE add_users.ejs
})

module.exports = router;


