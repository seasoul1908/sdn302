const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// Read Data
app.get('/data', (req, res) => {
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.status(200).json(JSON.parse(data));
    });
});

// Update Data
app.post('/update', (req, res) => {
    const newData = req.body;
    fs.writeFile(dataFile, JSON.stringify(newData, null, 4), (err) => {
        if (err) return res.status(500).send('Error writing file');
        res.status(200).json({ "message": "The data has been updated" });
    });
});

app.listen(port, () => {
    console.log(`Exercise 1 app listening at http://localhost:${port}`);
});
