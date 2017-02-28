const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});



const User = mongoose.model('user', userSchema);

User.find({ "username": { $regex: ".*son.*" } }, (err, users) => {
    console.log(users);
})

module.exports = User;