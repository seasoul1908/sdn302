const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || "An error occurred, please try again later." });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
