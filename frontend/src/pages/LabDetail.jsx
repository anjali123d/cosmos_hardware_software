import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiList, FiMapPin, FiCalendar, FiGrid, FiCornerUpLeft } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { returnItem } from '../services/api';

const LabDetail = () => {
    const { id } = useParams();
    const { labs, transactions, items, loading, refresh } = useAppContext();
    const [returningItemId, setReturningItemId] = useState(null);
    const [returnQty, setReturnQty] = useState(1);
    const [message, setMessage] = useState('');

    const lab = labs.find(l => l._id === id);

    // Compute current inventory (only positive quantities)
    const labInventory = useMemo(() => {
        if (!lab) return [];
        const labTrans = transactions.filter(t => t.lab?._id === id);
        const netMap = new Map();

        labTrans.forEach(t => {
            const itemId = t.item?._id;
            if (!itemId) return;
            const delta = t.type === 'issue' ? t.quantity : -t.quantity;
            const current = netMap.get(itemId) || 0;
            const newQty = current + delta;
            if (newQty <= 0) {
                netMap.delete(itemId);   // remove if zero or negative
            } else {
                netMap.set(itemId, newQty);
            }
        });

        const inventory = [];
        for (let [itemId, qty] of netMap.entries()) {
            const item = items.find(i => i._id === itemId);
            if (item && qty > 0) inventory.push({ ...item, labQuantity: qty });
        }
        return inventory.sort((a, b) => a.name.localeCompare(b.name));
    }, [transactions, lab, items]);

    const handleReturn = async (item) => {
        if (!returnQty || returnQty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        if (returnQty > item.labQuantity) {
            alert(`Cannot return more than ${item.labQuantity} (current lab stock)`);
            return;
        }
        try {
            await returnItem({ itemId: item._id, labId: lab._id, quantity: returnQty });
            const newQty = item.labQuantity - returnQty;
            if (newQty === 0) {
                setMessage(`✅ All ${item.name} returned successfully! Item removed from lab.`);
            } else {
                setMessage(`✅ Returned ${returnQty} of ${item.name}. Remaining: ${newQty}`);
            }
            setTimeout(() => setMessage(''), 3000);
            refresh(); // refresh data from backend
            setReturningItemId(null);
            setReturnQty(1);
        } catch (err) {
            alert(err.response?.data?.message || 'Return failed');
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading lab details...</p>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="error-state">
                <p>Lab not found.</p>
                <Link to="/labs" className="btn-primary">Back to Labs</Link>
            </div>
        );
    }

    const totalItems = labInventory.reduce((sum, item) => sum + item.labQuantity, 0);
    const uniqueItems = labInventory.length;

    return (
        <div className="lab-detail">
            <div className="detail-header">
                <Link to="/labs" className="back-link">
                    <FiArrowLeft size={18} /> Back to Labs
                </Link>
                <div className="lab-title-section">
                    <FiGrid size={28} className="lab-icon" />
                    <h1>{lab.name}</h1>
                </div>
            </div>

            {message && (
                <div className="toast-message">
                    <FiCornerUpLeft size={18} style={{ marginRight: 8 }} />
                    {message}
                </div>
            )}

            <div className="lab-stats-grid">
                <div className="stat-card-small">
                    <FiPackage size={24} />
                    <div className="stat-number">{uniqueItems}</div>
                    <div>Unique Items</div>
                </div>
                <div className="stat-card-small">
                    <FiList size={24} />
                    <div className="stat-number">{totalItems}</div>
                    <div>Total Quantity</div>
                </div>
                <div className="stat-card-small">
                    <FiCalendar size={24} />
                    <div className="stat-number">—</div>
                    <div>Last Updated</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <FiMapPin size={20} style={{ marginRight: 8 }} />
                    Current Stock in this Lab
                </div>
                {labInventory.length === 0 ? (
                    <div className="empty-state-small">
                        <FiPackage size={36} />
                        <p>No items currently held in this lab.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity in Lab</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labInventory.map(item => (
                                    <tr key={item._id}>
                                        <td className="item-name">{item.name}</td>
                                        <td className="quantity-cell">
                                            <span className={`quantity-badge ${item.labQuantity > 10 ? 'high' : item.labQuantity > 0 ? 'medium' : 'low'}`}>
                                                {item.labQuantity}
                                            </span>
                                        </td>
                                        <td className="description-cell">{item.description || '—'}</td>
                                        <td>
                                            {returningItemId === item._id ? (
                                                <div className="return-form">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.labQuantity}
                                                        value={returnQty}
                                                        onChange={e => setReturnQty(parseInt(e.target.value) || 1)}
                                                        className="return-input"
                                                    />
                                                    <button onClick={() => handleReturn(item)} className="btn-return-small">Confirm</button>
                                                    <button onClick={() => { setReturningItemId(null); setReturnQty(1); }} className="btn-secondary-small">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setReturningItemId(item._id)} className="btn-return-small">
                                                    <FiCornerUpLeft size={14} /> Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabDetail;