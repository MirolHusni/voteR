const express = require('express');
const router = express.Router();
const Poll = require('../models/polls.model');
const checkIp = require('../checkIp');


//Get All Polls 
router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        Poll.find({}, function (err, polls) {
            // res.json({ results: polls });
            res.render('polls', {
                authenticated: true,
                allPolls: polls
            });
        });
    } else {
        Poll.find({}, function (err, polls) {
            // res.json({ results: polls });
            res.render('polls', {
                authenticated: false,
                allPolls: polls
            });
        });
    }
});

//Get Specific Poll
router.get('/:pollId', function (req, res) {
    if (req.session && req.session.user) {
        Poll.findById(req.params.pollId, function (err, poll) {
            if (!poll) {
                res.sendStatus(404);
                return;
            }
            // res.json({ pollTitle: poll.title });
            res.render('eachpoll', {
                thisPoll: poll,
                authenticated: true,
            })
        });
    } else {
        Poll.findById(req.params.pollId, function (err, poll) {
            if (!poll) {
                res.sendStatus(404);
                return;
            }
            // res.json({ pollTitle: poll.title });
            res.render('eachpoll', {
                thisPoll: poll,
                authenticated: false,
            })
        });
    }
});



// Vote once per user. 
router.put('/:pollId', function (req, res) {
    checkIp(req.params.pollId,  req.headers['x-forwarded-for'])
        .then(function (originalIp) {
            if (originalIp) {
                submitVote(req.body.choice,res, req.headers['x-forwarded-for']);
            } else {
                res.json({ message: 'This ip has already voted' });
            }
        })
        .catch(function (err) { console.log(err) });
});

//Add Custom Option and Vote
router.post('/:pollId', function (req, res) {

    if (req.session && req.session.user) {

        checkIp(req.params.pollId, req.headers['x-forwarded-for'])
            .then(function (originalIp) {

                if (originalIp) {
                    Poll.findByIdAndUpdate(
                        req.params.pollId,
                        { $push: { choices: { title: req.body.custom } } },
                        { new: true },
                        function (err, poll) {
                            if (err) console.log(err);
                           submitVote(req.body.custom,res,req.headers['x-forwarded-for']);
                        });

                } else {
                    res.json({ message: 'You have already voted!' });
                }


            });
    }else{
        res.status(401).send('You must be a member to view this page.')
    }
});


//Function for voting.
function submitVote(field, res,ip) {

    Poll.findOneAndUpdate(
        { choices: { $elemMatch: { title: field } } },
        { $inc: { 'choices.$.count': 1 }, $addToSet: { 'votedIp': ip } },
        { new: true },
        function (err, poll) {
            if (err) throw err;
            res.json({ updated: poll });
        }
    )
}


module.exports = router;