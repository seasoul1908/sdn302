const express = require('express');
const fs = require('fs');
const path = require('path');
const videoRouter = express.Router();

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

videoRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const data = readData();
            res.status(200).json(data.videos);
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { title, duration, author } = req.body;

            if (!title || !duration || !author) {
                throw new Error("Missing required video fields");
            }

            const data = readData();
            const newVideo = {
                id: data.videos.length > 0 ? data.videos[data.videos.length - 1].id + 1 : 1,
                title,
                duration,
                author
            };
            data.videos.push(newVideo);
            writeData(data);
            res.status(201).json({ message: 'Added successful', video: newVideo });
        } catch (err) {
            next(err);
        }
    });

videoRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const video = data.videos.find(v => v.id === id);
            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }
            res.status(200).json(video);
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const index = data.videos.findIndex(v => v.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "Not Found" });
            }
            data.videos[index] = {
                ...data.videos[index],
                title: req.body.title || data.videos[index].title,
                duration: req.body.duration || data.videos[index].duration,
                author: req.body.author || data.videos[index].author
            };
            writeData(data);
            res.status(200).json({ message: "Update successful" });
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const index = data.videos.findIndex(v => v.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "Not Found" });
            }
            data.videos.splice(index, 1);
            writeData(data);
            res.status(200).json({ message: "Delete successful" });
        } catch (err) {
            next(err);
        }
    });

module.exports = videoRouter;