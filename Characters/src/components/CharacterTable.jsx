function CharacterTable({ characters, onEdit, onDelete }) {
    const deleteCharacter = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/characters/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Failed to delete character: ${response.status}`);
            console.log(`Deleted character with id ${id}`);
            onDelete();
        } catch (err) {
            console.error('Error deleting character:', err.message);
        }
    };

    return (
        <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Real Name</th>
                    <th className="border border-gray-300 p-2">Universe</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {characters.map((character) => (
                    <tr key={character.id}>
                        <td className="border border-gray-300 p-2">{character.id}</td>
                        <td className="border border-gray-300 p-2">{character.name}</td>
                        <td className="border border-gray-300 p-2">{character.realName}</td>
                        <td className="border border-gray-300 p-2">{character.universe}</td>
                        <td className="border border-gray-300 p-2 flex gap-2">
                            <button
                                onClick={() => {
                                    console.log('Editing character:', character);
                                    onEdit(character);
                                }}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => deleteCharacter(character.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CharacterTable;