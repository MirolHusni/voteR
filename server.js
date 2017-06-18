const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const config = require('./config');
const home = require('./routes/home');
const polls = require('./routes/polls');
const myPolls = require('./routes/mypolls');
const createPoll = require('./routes/createpoll');
const signUp = require('./routes/signup');
const authCallack = require('./routes/callback');
const login = require('./routes/login');
const logout = require('./routes/logout');
const app = express();

process.env.NODE_ENV = 'production';

//Mongoose setup 
mongoose.connect(config.database);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Connection to the database successful');
})

//View engine
app.set('view engine', 'ejs');

//Local Authentication.
app.use(express.static('public'));
app.use(session({
  cookieName: 'session',
  secret: 'asfasFHDFDHJDFJr5e4rwrsefzawq4',
  duration: 30 * 60 * 1000,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use('/', home);
app.use('/polls', polls);
app.use('/createpoll', createPoll);
app.use('/mypolls',myPolls);
app.use('/signup', signUp);
app.use('/callback',authCallack);
app.use('/login', login);
app.use('/logout', logout);


app.listen(config.port);

module.exports = app; 