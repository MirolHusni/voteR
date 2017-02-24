const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    req.session.reset();
    res.redirect('/');
});

module.exports = router;