const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
});

module.exports = mongoose.model('Comment', commentSchema);