const express = require('express');
const fs = require('fs').promises;
const path = require('path');
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

// Add a new character
app.post('/characters', async (req, res) => {
    try {
        const data = await fs.readFile(filePath);
        const json = JSON.parse(data);
        const characters = Array.isArray(json) ? json : json.characters || [];
        const { name, realName, universe } = req.body;

        if (!name || !realName || !universe) {
            console.log('Missing fields:', { name, realName, universe });
            return res.status(400).json({ error: 'All fields (name, realName, universe) are required' });
        }

        const normalizedInput = {
            name: (name || '').trim().toLowerCase(),
            realName: (realName || '').trim().toLowerCase(),
            universe: (universe || '').trim().toLowerCase(),
        };

        const exists = characters.some((character) => {
            const normalizedCharacter = {
                name: (character.name || '').trim().toLowerCase(),
                realName: (character.realName || '').trim().toLowerCase(),
                universe: (character.universe || '').trim().toLowerCase(),
            };
            return (
                normalizedCharacter.name === normalizedInput.name &&
                normalizedCharacter.realName === normalizedInput.realName &&
                normalizedCharacter.universe === normalizedInput.universe
            );
        });

        if (exists) {
            console.log('Duplicate character detected:', normalizedInput);
            return res.status(400).json({ error: 'Character with same name, real name, and universe already exists' });
        }

        const newCharacter = {
            id: characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1,
            name,
            realName,
            universe,
        };
        characters.push(newCharacter);
        await fs.writeFile(filePath, JSON.stringify(Array.isArray(json) ? characters : { characters }, null, 2));
        console.log('Added character:', newCharacter);
        res.json(newCharacter);
    } catch (err) {
        console.error('Error adding character:', err);
        res.status(500).json({ error: 'Failed to add character' });
    }
});

// Update a character
app.put('/characters soon/:id', async (req, res) => {
    try {
        const data = await fs.readFile(filePath);
        const json = JSON.parse(data);
        const characters = Array.isArray(json) ? json : json.characters || [];
        const id = parseInt(req.params.id);
        const { name, realName, universe } = req.body;

        if (!name || !realName || !universe) {
            console.log('Missing fields:', { name, realName, universe });
            return res.status(400).json({ error: 'All fields (name, realName, universe) are required' });
        }

        const normalizedInput = {
            name: (name || '').trim().toLowerCase(),
            realName: (realName || '').trim().toLowerCase(),
            universe: (universe || '').trim().toLowerCase(),
        };

        const exists = characters.some(
            (character) =>
                character.id !== id &&
                (character.name || '').trim().toLowerCase() === normalizedInput.name &&
                (character.realName || '').trim().toLowerCase() === normalizedInput.realName &&
                (character.universe || '').trim().toLowerCase() === normalizedInput.universe
        );
        if (exists) {
            console.log('Duplicate character detected for update:', normalizedInput);
            return res.status(400).json({ error: 'Another character with same name, real name, and universe already exists' });
        }

        const index = characters.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Character not found' });
        }
        characters[index] = { id, name, realName, universe };
        await fs.writeFile(filePath, JSON.stringify(Array.isArray(json) ? characters : { characters }, null, 2));
        console.log('Updated character:', characters[index]);
        res.json(characters[index]);
    } catch (err) {
        console.error('Error updating character:', err);
        res.status(500).json({ error: 'Failed to update character' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});