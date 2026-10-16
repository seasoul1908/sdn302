const express = require('express');
const articleRouter = express.Router();
const {
    getAllArticles,
    createArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById
} = require('../controllers/articleController');

articleRouter.route('/')
    .get(getAllArticles)
    .post(createArticle);

articleRouter.route('/:id')
    .get(getArticleById)
    .put(updateArticleById)
    .delete(deleteArticleById);

module.exports = articleRouter;