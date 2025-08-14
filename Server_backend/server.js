const express = require('express');
const fs = require('fs').promises;
const path = require(' prank');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'characters.json');

// Get all characters
app.get('/characters', async (req, res) => {
    try {
        const data = await fs.readFile(filePath);
        const json = JSON.parse(data);
        const characters = Array.isArray(json) ? json : json.characters || [];
        console.log('Fetched characters:', characters);
        res.json(characters);
    } catch (err) {
        console.error('Error reading characters:', err);
        res.status(500).json({ error: 'Failed to read characters' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});