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

//Calculate how many choices are being sent.
    let keys = Object.keys(req.body)
    let choicesArr = [];
    for(let i=1;i<keys.length;i++){
        choicesArr.push({title: req.body[keys[i]]})
    }

    let newPoll = new Poll({
        title: req.body.title,
        choices: choicesArr,
        createdBy: req.session.user.username
    }).save(function (err, poll) {
        if (err) throw err
        res.redirect('/mypolls')
    });
});


module.exports = router;