// Exercise 1
const validateArticle = async (req, res, next) => {
    try {
        const { title, date, text } = req.body;

        if (!title || !date || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating article');
    }
};

// Exercise 2
const validateDate = async (req, res, next) => {
    try {
        const { date } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (date && !dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Expected format: YYYY-MM-DD' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating date format');
    }
};

// Exercise 3
const validateTextLength = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (text && (text.length < 10 || text.length > 256)) {
            return res.status(400).json({ error: 'Text must be between 10 and 256 characters long' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating text length');
    }
};

module.exports = {
    validateArticle,
    validateDate,
    validateTextLength
};