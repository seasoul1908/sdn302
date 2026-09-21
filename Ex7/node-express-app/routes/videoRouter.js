const express = require('express');
const fs = require('fs');
const path = require('path');
const videoRouter = express.Router();

const dbPath = path.join(__dirname, '../db.json');

const readData = () => {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
};

const writeData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

videoRouter.route('/')
    .get(async (req, res) => {
        try {
            const data = readData();
            res.status(200).json(data.videos);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const data = readData();
            const newVideo = {
                id: data.videos.length > 0 ? data.videos[data.videos.length - 1].id + 1 : 1,
                title: req.body.title,
                duration: req.body.duration,
                author: req.body.author
            };
            data.videos.push(newVideo);
            writeData(data);
            res.status(200).json({ message: 'Added successful', video: newVideo });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

videoRouter.route('/:id')
    .get(async (req, res) => {
        try {
            const data = readData();
            const id = parseInt(req.params.id);
            const video = data.videos.find(v => v.id === id);
            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }
            res.status(200).json(video);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .put(async (req, res) => {
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
            res.status(500).json({ message: err.message });
        }
    })
    .delete(async (req, res) => {
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
            res.status(500).json({ message: err.message });
        }
    });

module.exports = videoRouter;