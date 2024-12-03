const express = require('express');
const router = express.Router();

//URL
router.get("/", (req, res) => {
    res.render("index", { title: "Home Page" })    // CONNECTED TO HTML 
});

module.exports = router;


