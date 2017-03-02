const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/', function (req, res) {

    sendAuth(req.query.code, req.query.state);


    function sendToGit(token) {
        
        request.get('https://api.github.com/user?access_token=' + token, {
            headers: {
                'User-Agent': 'request'
            }
        }, function (err, response, body) {

            let data = JSON.parse(body);
            req.session.user = data.login
            console.log(req.session.user)
            res.redirect('/')

        });
    }


    function sendAuth(code, state) {

        let authData = {
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            code: code,
            redirect_uri: 'http://localhost:3000/callback',
            state: state
        }

        request.post({
            url: 'https://github.com/login/oauth/access_token',
            form: authData
        },
            function (err, response, body) {
                if (err) throw err;
                token = body.substring(body.indexOf('=') + 1, body.indexOf('&'));
                sendToGit(token);
            });
    }

});





module.exports = router;