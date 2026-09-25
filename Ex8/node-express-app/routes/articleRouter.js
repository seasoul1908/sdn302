const express = require('express');
const fs = require('fs');
const path = require('path');
const articleRouter = express.Router();

const filepath = path.join(__dirname, '../db.json');

async function readData() {
    try {
        const data = await fs.promises.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { articles: [], comments: [] };
    }
};

async function writeData(data) {
    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
};

articleRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const data = readData();
            res.status(200).json(data.articles);
        } catch (err) {
            next(err);
        }
    })

    .post(async (req, res, next) => {
        try {
            const { title, date, text } = req.body;

            if (!title || !date || !text) {
                throw new Error("Missing required article fields");
            }

            const data = readData();
            const newArticle = {
                id: data.articles.length > 0 ? data.articles[data.articles.length - 1].id + 1 : 1,
                title: title,
                date: date,
                text: text
            };
            data.articles.push(newArticle);
            writeData(data);
            res.status(201).json({ message: 'Added successful' });
        } catch (err) {
            next(err);
        }
    });

articleRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const article = data.articles.find(a => a.id === id);
            if (!article) {
                return res.status(404).json({ message: `Article ${id} not found` });
            }
            res.status(200).json(article);
        } catch (err) {
            next(err);
        }
    })

    .put(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const index = data.articles.findIndex(a => a.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "Not Found" });
            }
            data.articles[index] = {
                ...data.articles[index],
                title: req.body.title || data.articles[index].title,
                date: req.body.date || data.articles[index].date,
                text: req.body.text || data.articles[index].text
            };
            writeData(data);
            res.status(200).json({ message: "update successful" });
        } catch (err) {
            next(err);
        }
    })

    .delete(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const index = data.articles.findIndex(a => a.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "Not Found" });
            }
            data.articles.splice(index, 1);
            writeData(data);
            res.status(200).json({ message: "Delete successful" });
        } catch (err) {
            next(err);
        }
    });

module.exports = articleRouter;