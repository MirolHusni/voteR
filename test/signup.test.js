const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const User = require('../models/users.model');


describe('/signup GET', function () {
    it('responds with signup form if unauthenticated', function (done) {
        chai.request(server).get('/signup').end(function (err, res) {
            expect(res.status).to.equal(200);
            expect(res).to.be.html;
            done();
        });
    });
});

describe('/signup POST', function () {

    let sampleUser = {
        username: 'Momo',
        password: 'woot!'
    }

    let testUser = {
        username: 'Testuser',
        password: 'Testpassword'
    }


    it('should sign up a new user, and should save the user to the database', function (done) {

        chai.request(server).post('/signup').send(sampleUser).end(function (err, res) {
            User.findOne(sampleUser, function (err, user) {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                // expect(res.body.retrievedUser).to.equal(user.username);
                expect(res).to.be.html;
                expect(res).to.redirect;
                done();
            });
        });
    });

    it('should not allow you to save an existing username', function (done) {
        chai.request(server).post('/signup').send(sampleUser).end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            // expect(res.body.message).to.equal('This username exists');
            done();
        });
    });

    //empty collection for user Momo each time to run tests.
    after(function (done) {
        User.remove({ username: 'Momo' }, function (err, doc) {
            if (err) throw err;
            done();
        });
    });
});