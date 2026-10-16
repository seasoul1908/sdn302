const express = require('express');
const connectDB = require("./config/db");
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/article', articleRouter);
app.use('/comment', commentRouter);
const startServer = async () => {
    await connectDB();
    app.get('/', async (req, res) => {
        try {
            res.status(200).send({ message: 'Welcome to Practical Exam!' })
        } catch (error) {
            res.send({ error: error.message })
        }
    })
    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();