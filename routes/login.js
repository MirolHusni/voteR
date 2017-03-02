const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const http = require('http');


router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        res.status(401).send('You are already logged in');
    } else {
        res.render('login', { error: false, authenticated: false });
    }
});

router.post('/', function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
            res.render('login', {
                error: true,
                authenticated: false,
                errorMessage: 'Incorrect login details'
            });
        } else {
            if (req.body.username === user.username && req.body.password === user.password) {
                req.session.user = user; //Set-cookie in response header.
                res.redirect('/');
            } else {
                res.render('login', {
                    error: true,
                    authenticated: false,
                    errorMessage: 'Incorrect login details'
                });
            }
        }
    });
});

module.exports = router;