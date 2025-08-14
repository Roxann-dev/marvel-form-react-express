import { useState, useEffect } from 'react';
import CharacterTable from './components/CharacterTable.jsx';
import CharacterForm from './components/CharacterForm.jsx';

function App() {
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/characters');
      if (!response.ok) throw new Error(`Failed to fetch characters: ${response.status}`);
      const data = await response.json();
      console.log('Fetched characters:', data);
      setCharacters(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching characters:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Character Management</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {!loading && !error && characters.length === 0 && (
            <div className="text-center">No characters found</div>
        )}
        {!loading && characters.length > 0 && (
            <>
              <CharacterTable
                  characters={characters}
                  onEdit={setEditingCharacter}
                  onDelete={fetchCharacters}
              />
              <CharacterForm
                  editingCharacter={editingCharacter}
                  setEditingCharacter={setEditingCharacter}
                  onSubmit={fetchCharacters}
              />
            </>
        )}
      </div>
  );
}

export default App;