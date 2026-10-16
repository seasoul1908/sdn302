const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    text: { type: String, required: true },
    comments: [{
        body: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    tags: { type: [String] }
});

module.exports = mongoose.model('Article', articleSchema);