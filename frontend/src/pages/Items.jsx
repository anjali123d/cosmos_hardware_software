import React, { useState } from 'react';
import { FiPlus, FiX, FiCheck, FiPackage, FiCornerUpLeft, FiArrowRight } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { addItem, issueItem, returnItem, ensureCentralStore } from '../services/api';

const Items = () => {
    const { items, refresh, labs } = useAppContext();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: 0, description: '' });
    const [actionModal, setActionModal] = useState({ show: false, item: null, type: '' });
    const [qty, setQty] = useState(1);
    const [selectedLab, setSelectedLab] = useState('');
    const [message, setMessage] = useState('');

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await addItem(newItem);
            setNewItem({ name: '', quantity: 0, description: '' });
            setShowAddForm(false);
            refresh();
            setMessage('Item added successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert('Error adding item');
        }
    };

    const openActionModal = (item, type) => {
        setActionModal({ show: true, item, type });
        setQty(1);
        setSelectedLab('');
    };

    const handleStockAction = async () => {
        const { item, type } = actionModal;
        if (!selectedLab) return alert('Please select a lab');
        if (qty <= 0) return alert('Quantity must be > 0');

        // ✅ Frontend validation for issue: check available stock
        if (type === 'issue' && qty > item.quantity) {
            alert(`Not enough stock. Only ${item.quantity} available.`);
            return;
        }

        try {
            if (type === 'issue') {
                await issueItem({ itemId: item._id, labId: selectedLab, quantity: qty });
            } else {
                await returnItem({ itemId: item._id, labId: selectedLab, quantity: qty });
            }
            setActionModal({ show: false, item: null, type: '' });
            refresh();
            setMessage(`${type === 'issue' ? 'Issued' : 'Returned'} ${qty} of ${item.name}`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    const handleRestock = async (item) => {
        const central = await ensureCentralStore();
        if (!central) return alert('Could not find/create Central Store lab');
        const qty = prompt(`Enter quantity to add to ${item.name} (increase stock):`, '1');
        if (!qty || isNaN(qty) || +qty <= 0) return;
        try {
            await returnItem({ itemId: item._id, labId: central._id, quantity: +qty });
            refresh();
            setMessage(`Added ${qty} to ${item.name}`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert('Restock failed');
        }
    };

    // Determine max quantity for input based on action type
    const maxQty = actionModal.type === 'issue' && actionModal.item ? actionModal.item.quantity : undefined;

    return (
        <div>
            <div className="items-header">
                <h1>Items & Stock</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                    {showAddForm ? <FiX size={18} /> : <FiPlus size={18} />}
                    {showAddForm ? ' Cancel' : ' Add New Item'}
                </button>
            </div>

            {message && (
                <div className="toast-message">
                    <FiCheck size={18} style={{ marginRight: 8 }} />
                    {message}
                </div>
            )}

            {showAddForm && (
                <div className="card">
                    <div className="card-header">Add New Item</div>
                    <form onSubmit={handleAddItem}>
                        <div className="form-group">
                            <label>Name</label>
                            <input required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Initial Quantity</label>
                            <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: +e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-primary">Save Item</button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">All Items</div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td style={{ fontWeight: 'bold', color: item.quantity < 5 ? '#ef4444' : '#333' }}>
                                        {item.quantity}
                                    </td>
                                    <td>{item.description || '-'}</td>
                                    <td className="action-buttons">
                                        <button className="btn-issue" onClick={() => openActionModal(item, 'issue')}>
                                            <FiArrowRight size={14} /> Issue
                                        </button>

                                        <button className="btn-restock" onClick={() => handleRestock(item)}>
                                            <FiPlus size={14} /> Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal */}
            {actionModal.show && (
                <div className="modal-overlay" onClick={() => setActionModal({ show: false })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>
                            {actionModal.type === 'issue' ? <FiArrowRight /> : <FiCornerUpLeft />}
                            {actionModal.type === 'issue' ? ' Issue Item' : ' Return Item'}
                        </h3>
                        <p>
                            <strong>{actionModal.item?.name}</strong>
                            {actionModal.type === 'issue' && (
                                <> (Available stock: {actionModal.item?.quantity})</>
                            )}
                        </p>
                        <div className="form-group">
                            <label>Select Lab</label>
                            <select value={selectedLab} onChange={e => setSelectedLab(e.target.value)} required>
                                <option value="">-- Choose Lab --</option>
                                {labs.map(lab => (
                                    <option key={lab._id} value={lab._id}>{lab.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max={maxQty}
                                value={qty}
                                onChange={e => setQty(+e.target.value)}
                            />
                            {maxQty && <small style={{ color: '#64748b' }}>Max available: {maxQty}</small>}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleStockAction} className="btn-primary">Confirm</button>
                            <button className="btn-secondary" onClick={() => setActionModal({ show: false })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Items;