const Article = require('../models/article');

// GET all articles
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new article
const createArticle = async (req, res) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET an article by ID
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an article by ID
const updateArticleById = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(article);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an article by ID
const deleteArticleById = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllArticles,
    createArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById
};
