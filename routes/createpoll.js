const express = require('express');
const router = express.Router();
const Poll = require('../models/polls.model');


//Get create poll form. 
router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        res.render('createPoll', {
            authenticated: true,
        });
    } else {
        res.json({ message: 'You must be authorized to access this page' });
    }
});

//Send create poll data and save new poll.
router.post('/', function (req, res) {
    let newPoll = new Poll({
        title: req.body.title,
        choices: [{ title: req.body.choice1 }, { title: req.body.choice2 }, { title: req.body.choice3 }],
        createdBy: req.session.user.username
    }).save(function (err, poll) {
        if (err) throw err
        // res.json({
        //     message: 'New poll created',
        //     poll: poll
        // })
        res.redirect('/mypolls')
    });
});


module.exports = router;