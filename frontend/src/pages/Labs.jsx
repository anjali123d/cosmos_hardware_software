import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiX, FiGrid, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { addLab } from '../services/api';

const Labs = () => {
    const { labs, refresh } = useAppContext();
    const [newLabName, setNewLabName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddLab = async (e) => {
        e.preventDefault();
        if (!newLabName.trim()) return;
        try {
            await addLab({ name: newLabName });
            setNewLabName('');
            setShowForm(false);
            refresh();
            setMessage(`Lab "${newLabName}" created successfully!`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert('Error adding lab');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>
                    <FiGrid size={28} style={{ marginRight: 12, verticalAlign: 'middle' }} />
                    Labs
                </h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? <FiX size={18} /> : <FiPlus size={18} />}
                    {showForm ? ' Cancel' : ' Add Lab'}
                </button>
            </div>

            {message && (
                <div className="toast-message">
                    <FiCheck size={18} style={{ marginRight: 8 }} />
                    {message}
                </div>
            )}

            {showForm && (
                <div className="card">
                    <div className="card-header">Create New Lab</div>
                    <form onSubmit={handleAddLab}>
                        <div className="form-group">
                            <label>Lab Name</label>
                            <input
                                autoFocus
                                value={newLabName}
                                onChange={e => setNewLabName(e.target.value)}
                                placeholder="e.g., Chemistry Lab, Physics Lab"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <FiCheck size={18} /> Create Lab
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">All Labs</div>
                {labs.length === 0 ? (
                    <div className="empty-state">
                        {/* <FiBuilding size={48} /> */}
                        <p>No labs yet. Click "Add Lab" to create one.</p>
                    </div>
                ) : (
                    <div className="labs-grid">
                        {labs.map(lab => (
                            <div key={lab._id} className="lab-card">
                                <div className="lab-card-header">
                                    {/* <FiBuilding size={24} /> */}
                                    <h3>{lab.name}</h3>
                                </div>
                                <div className="lab-card-body">
                                    <p>Lab ID: {lab._id.slice(-6)}</p>
                                    <p>Created: {new Date(lab.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="lab-card-footer">
                                    <Link to={`/labs/${lab._id}`} className="btn-link">
                                        View Stock <FiArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Labs;