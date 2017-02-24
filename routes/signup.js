const express = require('express');
const router = express.Router();
const User = require('../models/users.model');

//Sign up form
router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        res.status(401).send('You are already logged in');
    } else {
        res.render('signup', { authenticated: false, error: false });
    }
});

//Save new unique users to database if username is unique.
router.post('/', function (req, res) {

    User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
            let newMember = new User({
                username: req.body.username,
                password: req.body.password
            }).save(function (err, user) {
                req.session.user = user; //Set cookies 
                // res.json({retrievedUser:user.username})
                // res.redirect('createpoll')
                res.redirect('/');
            });
        } else {
            // res.json({message:'This username exist'})
            res.render('signup', {
                error: true,
                errorMessage: 'This username exists',
                authenticated: false
            });
        }
    });

});


module.exports = router;