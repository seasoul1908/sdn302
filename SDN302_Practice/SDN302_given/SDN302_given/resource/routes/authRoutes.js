const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/tokens
router.post('/tokens', authController.login);

module.exports = router;
