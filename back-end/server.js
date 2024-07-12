const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Route to generate JWT token (this occurs when the page is first loaded)
app.get('/api/token', (req, res) => {
    const token = jwt.sign({ user: 'guest' }, process.env.SECRET_KEY, { expiresIn: '3h' });
    res.json({ token });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token. The session may have timed out - refresh page and try again' });
        }
        req.user = decoded;
        next();
    });
};

// Route to search the iTunes API and returns the given results
app.get('/api/search', verifyToken, async (req, res) => {
    const { term, media } = req.query;
    try {
        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term,
                media
            }
        });
        console.log(response);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});