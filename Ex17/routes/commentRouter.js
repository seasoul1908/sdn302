const express = require('express');
const commentRouter = express.Router();
const {
    getAllComments,
    createComment
} = require('../controllers/commentController');

commentRouter.use(express.json());

commentRouter.route('/')
    .get(getAllComments)
    .post(createComment);

module.exports = commentRouter;