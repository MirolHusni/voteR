const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mongoose = require('mongoose');
const Poll = require('../models/polls.model');
const agent = require('./home.test');


describe('/polls GET', function () {

    it('responds with all polls from db', function (done) {
        chai.request(server).get('/polls').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.results).to.not.be.empty;
            expect(Array.isArray(res.body.results)).to.be.ok;
            done();
        });
    });
});

describe('/:pollId GET', function () {

    it('responds with specific poll based on id', function (done) {
        chai.request(server).get('/polls/58ab71db13e90e3c0d333eef').end(function (err, res) {
            expect(err).to.be.null
            expect(res.status).to.equal(200);
            expect('Who did you vote for in the presidential ellections').to.equal(res.body.pollTitle);
            done();
        });
    });

    it('responds with 404 if invalid id', function (done) {
        chai.request(server).get('/polls/1234').end(function (err, res) {
            expect(res.status).to.equal(404);
            done();
        });
    });

});

describe('/:pollId PUT', function () {

    let sampleDoc = {
        name: 'Donald Trump',
        ip: 'Some ip',
        Id: '58ab71db13e90e3c0d333eef'
    };


    it('should update the count field of the particular vote by 1 if ip is original ', function (done) {
        chai.request(server).put('/polls/58ab71db13e90e3c0d333eef').send(sampleDoc).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.updated.choices[0].count).to.equal(1);
            expect(res.body.updated.choices[1].count).to.not.equal(1);
            done();
        });
    });

    it('should not let the user vote if ip exists', function (done) {
        chai.request(server).put('/polls/58ab71db13e90e3c0d333eef').send(sampleDoc).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('This ip has already voted');
            done();
        });
    });

    it('should allow an authenticated user to add custom voting options', function (done) {
        sampleDoc.custom = 'Barack Obama'
        agent.post('/polls/58ab71db13e90e3c0d333eef').send(sampleDoc).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.updated.choices).to.have.length.of(3);
            expect(res.body.updated.choices)
            done();
        });
    });

    //reset 
    after(function (done) {
        Poll.findOneAndUpdate(
            { choices: { $elemMatch: { title: sampleDoc.name } } },
            { $set: { 'choices.$.count': 0, votedIp: [] } },
            function (err, poll) {
                if (err) throw err;
            }
        )
        Poll.findByIdAndUpdate('58ab71db13e90e3c0d333eef', { $pop: { choices: 1 } }, function (err,doc) {
            if (err) throw err
            done();
        });
    });

});

