const chai = require('chai');
const expect = chai.expect;
const server = require('../server');

describe('/logout GET',function(){
    it('should end user session and redirect back home',function(done){
        chai.request(server).get('/logout').end(function(err,res){
            expect(res.status).to.equal(200);
            expect(res).to.redirect;
            done();
        });
    });
});