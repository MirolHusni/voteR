const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const User = require('../models/users.model');



describe('/login GET', function () {

    it('responds with login form if not logged in', function (done) {
        chai.request(server).get('/login').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res).to.be.html
            // expect(res.body.form).to.equal('login form')
            done();
        });
    });
});

describe('/login POST', function () {

    let sampleUser = {
        username: "Testuser",
        password: "Testpassword"
    };

    let nonExistingUser = {
        username: "I don't exist",
        password: "invisible"
    };


    it('should respond with incorrect details if you aren\'t a member', function (done) {
        chai.request(server).post('/login').send(nonExistingUser).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res).to.be.html;
            // expect(res.body.message).to.equal('Incorrect login details');
            done();
        });
    });

    // If res has cookie session, user is authenticated.
    it('If login details are correct, it send to homepage', function (done) {
        chai.request(server).post('/login').send(sampleUser).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res).to.redirect;
            done();
        });
    });
});