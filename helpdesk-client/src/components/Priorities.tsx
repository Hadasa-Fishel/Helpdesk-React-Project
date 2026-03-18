import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const Priorities = () => {
    const [priorities, setPriorities] = useState<{id: number, name: string}[]>([]);
    const [newName, setNewName] = useState('');

    const fetchPriorities = async () => {
        const data = await apiRequest('/priorities');
        setPriorities(data);
    };

    useEffect(() => { fetchPriorities(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiRequest('/priorities', 'POST', { name: newName });
        setNewName('');
        fetchPriorities();
    };

    return (
        <div style={{ padding: '30px' }}>
            <h1>ניהול רמות עדיפות</h1>
            <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
                <input 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    placeholder="שם עדיפות (למשל: דחוף ביותר)" 
                    style={{ padding: '10px', width: '250px' }}
                />
                <button type="submit">הוסף</button>
            </form>
            <ul>
                {priorities.map(p => <li key={p.id}>{p.name} (ID: {p.id})</li>)}
            </ul>
        </div>
    );
};

export default Priorities;