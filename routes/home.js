const express = require('express');
const router = express.Router();
const User = require('../models/users.model');


router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        User.findOne({ username: req.session.user.username }, function (err, user) {
            res.locals.user = user;
            // res.json({ message: 'Welcome' });
            res.render('index', { authenticated: true });
        });
    } else {
        res.locals.authenticated = false;   
        res.render('index');
    }
});

module.exports = router;