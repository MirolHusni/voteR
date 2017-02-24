const express = require('express');
const router = express.Router();
const Polls = require('../models/polls.model')

router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        Polls.find({ createdBy: req.session.user.username }, function (err, poll) {
            if (poll.length === 0) {
                console.log(poll)
                res.redirect('/createpoll')
            } else {
                res.render('myPolls', {
                    authenticated: true,
                    myPolls: poll,
                    nopolls: false
                });
            }
        });
    } else {
        res.status(401)
    }
});

module.exports = router;