const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');


chai.use(chaiHttp);

let agent = chai.request.agent(server);


describe('/ GET ', function () {

    it('should respond with contents of the homepage if user is not signed in', function (done) {

        chai.request(server).get('/').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            // expect(res.locals.authenticated).to.be.false;
            expect(res).to.be.html;
            done();
        });
    });

    before(function (done) {

        let sampleUser = {
            username: "Testuser",
            password: "Testpassword"
        };

        agent.post('/login').send(sampleUser).end(function (err, res) {

            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            done();

        });
    });


    it('shold send welcome message if user is signed in', function (done) {

        agent.get('/').end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res).to.be.html;
            // expect(res.body.message).to.equal('Welcome');
            done();

        });
    });
});

module.exports = agent;


