const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pollSchema = new Schema({
    title: { type: String, unique: true, required: true },
    choices: [
        {
            title: { type: String, required: true },
            count: { type: Number, default: 0 }
        }
    ],
    votedIp: [{ type: String, unique: true }],
    createdAt: {type:Date, default:Date.now()},
    createdBy: String
})

const Poll = mongoose.model('polls', pollSchema);



module.exports = Poll;