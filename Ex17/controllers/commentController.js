const Comment = require('../models/comment');

// GET all comments
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('article');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new comment
const createComment = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllComments,
    createComment
};
