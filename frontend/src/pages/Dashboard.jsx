import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FiPackage, FiGrid, FiRepeat, FiAlertTriangle } from 'react-icons/fi';

const Dashboard = () => {
    const { items, labs, transactions, loading } = useAppContext();

    if (loading) return <div>Loading dashboard...</div>;

    const totalItems = items.length;
    const totalLabs = labs.length;
    const totalTransactions = transactions.length;
    const lowStockItems = items.filter(item => item.quantity < 5);
    const recentTransactions = [...transactions].reverse().slice(0, 5);

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <FiPackage size={32} color="#3b82f6" />
                    <div className="stat-number">{totalItems}</div>
                    <div>Total Items</div>
                </div>
                <div className="stat-card">
                    <FiGrid size={32} color="#3b82f6" />
                    <div className="stat-number">{totalLabs}</div>
                    <div>Total Labs</div>
                </div>
                <div className="stat-card">
                    <FiRepeat size={32} color="#3b82f6" />
                    <div className="stat-number">{totalTransactions}</div>
                    <div>Transactions</div>
                </div>
            </div>

            {/* {lowStockItems.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <FiAlertTriangle style={{ marginRight: 8 }} /> Low Stock Items (&lt;5)
                    </div>
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Quantity</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            {lowStockItems.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.quantity}</td>
                                    <td>{item.description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )} */}

            <div className="card">
                <div className="card-header">Recent Transactions</div>
                {recentTransactions.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr><th>Item</th><th>Lab</th><th>Qty</th><th>Type</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(t => (
                                <tr key={t._id}>
                                    <td>{t.item?.name || '?'}</td>
                                    <td>{t.lab?.name || '?'}</td>
                                    <td>{t.quantity}</td>
                                    <td style={{ color: t.type === 'issue' ? '#ef4444' : '#10b981' }}>
                                        {t.type.toUpperCase()}
                                    </td>
                                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;