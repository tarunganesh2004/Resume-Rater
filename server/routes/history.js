// @ts-nocheck
const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/', authMiddleware, getHistory);

module.exports = router;