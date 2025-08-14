import { useState, useEffect } from 'react';

function CharacterForm({ editingCharacter, setEditingCharacter, onSubmit }) {
    const [formData, setFormData] = useState({ name: '', realName: '', universe: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingCharacter) {
            setFormData({
                name: editingCharacter.name || '',
                realName: editingCharacter.realName || '',
                universe: editingCharacter.universe || '',
            });
            console.log('Form pre-filled with:', editingCharacter);
        } else {
            setFormData({ name: '', realName: '', universe: '' });
            console.log('Form reset to empty');
        }
    }, [editingCharacter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.realName.trim() || !formData.universe.trim()) {
            setError('All fields are required');
            console.log('Validation error: All fields are required');
            return;
        }
        try {
            if (editingCharacter) {
                const response = await fetch(`http://localhost:3000/characters/${editingCharacter.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to update character: ${response.status}`);
                }
                console.log('Updated character:', formData);
            } else {
                const response = await fetch('http://localhost:3000/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to add character: ${response.status}`);
                }
                console.log('Added character:', formData);
            }
            setFormData({ name: '', realName: '', universe: '' });
            setEditingCharacter(null);
            setError(null);
            onSubmit();
            console.log('Form cleared after submit');
        } catch (err) {
            console.error('Error submitting form:', err.message);
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', realName: '', universe: '' });
        setEditingCharacter(null);
        setError(null);
        console.log('Form cancelled');
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">
                {editingCharacter ? `Edit Character #${editingCharacter.id}` : 'Add New Character'}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Real Name"
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Universe"
                    value={formData.universe}
                    onChange={(e) => setFormData({ ...formData, universe: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        {editingCharacter ? 'Update' : 'Submit'}
                    </button>
                    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CharacterForm;