const express = require('express');
const router = express.Router();

//URL
router.get('/users', (req, res) => {
    res.send('WELCOME TO THE MOBILE LEGEND');
});

module.exports = router;


