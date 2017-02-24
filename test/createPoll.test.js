const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mongoose = require('mongoose');
const Poll = require('../models/polls.model');
const agent = require('./home.test');


describe('/createpoll GET', function () {

    let sampleUser = {
        username: "Testuser",
        password: "Testpassword"
    };

    before(function (done) {
        agent.post('/login').send(sampleUser).end(function (err, res) {
            expect(err).to.be.null;
            done();
        });
    });

    it('should respond with form to create new poll if user is logged in', function (done) {

        agent.get('/createpoll').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.createPollPage).to.equal('Create a new poll');
            done();
        });
    });

    it('should not let an unauthenticated user create polls', function (done) {
        chai.request(server).get('/createpoll').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('You must be authorized to access this page');
            done();
        });
    });
});


describe('/createpoll POST', function () {

    let samplePollForm = {
        title: "What is your favourite color",
        choice1: 'Red',
        choice2: 'Green',
        choice3: 'Blue'
    };

    it('if authenticated,should save new poll to the database', function (done) {

        agent.post('/createpoll').send(samplePollForm).end(function (err, res) {
            if (err) throw err;
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('New poll created');
            expect(res.body.poll.title).to.equal(samplePollForm.title);
            expect(res.body.poll.choices[0].title).to.equal(samplePollForm.choice1);
            expect(res.body.poll.choices[1].title).to.equal(samplePollForm.choice2);
            expect(res.body.poll.choices[2].title).to.equal(samplePollForm.choice3);
            done();

        });

        //empty db aftr every test because title is unuique.
        after(function (done) {
            Poll.findOne({ 'title': "What is your favourite color" }, function (err, doc) {
                if (err) throw err;
                doc.remove(function (err) {
                    if (err) throw err;
                    done();
                });
            });
        });
    });
});