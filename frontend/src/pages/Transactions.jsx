import React, { useState, useMemo } from 'react';
import { FiList, FiFilter, FiArrowUp, FiArrowDown, FiPackage, FiGrid, FiCalendar } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const Transactions = () => {
    const { transactions, loading } = useAppContext();
    const [filterType, setFilterType] = useState('all'); // 'all', 'issue', 'return'
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }
        // sort by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        return filtered;
    }, [transactions, filterType, sortOrder]);

    const stats = useMemo(() => {
        const total = transactions.length;
        const issues = transactions.filter(t => t.type === 'issue').length;
        const returns = transactions.filter(t => t.type === 'return').length;
        return { total, issues, returns };
    }, [transactions]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="transactions-page">
            <div className="page-header">
                <h1>
                    <FiList size={28} style={{ marginRight: 12, verticalAlign: 'middle' }} />
                    Transactions
                </h1>
            </div>

            <div className="transactions-stats-grid">
                <div className="stat-card-small">

                    <div className="stat-number">{stats.total}</div>
                    <div>Total Transactions</div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-number issue-count">{stats.issues}</div>
                    <div>Issues</div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-number return-count">{stats.returns}</div>
                    <div>Returns</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="filter-controls">
                        <div className="filter-group">
                            <FiFilter size={16} />
                            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <option value="all">All Types</option>
                                <option value="issue">Issues Only</option>
                                <option value="return">Returns Only</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <FiCalendar size={16} />
                            <button
                                className="sort-btn"
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            >
                                {sortOrder === 'desc' ? <FiArrowDown /> : <FiArrowUp />}
                                {sortOrder === 'desc' ? ' Newest First' : ' Oldest First'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Lab</th>
                                <th>Quantity</th>
                                <th>Type</th>
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state-small">
                                            <FiList size={36} />
                                            <p>No transactions recorded.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map(t => (
                                    <tr key={t._id}>
                                        <td className="item-name">
                                            <FiPackage size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                            {t.item?.name || 'Deleted item'}
                                        </td>
                                        <td>
                                            <FiGrid size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                            {t.lab?.name || 'Deleted lab'}
                                        </td>
                                        <td className="quantity-cell">{t.quantity}</td>
                                        <td>
                                            <span className={`transaction-badge ${t.type}`}>
                                                {t.type === 'issue' ? '📤 Issue' : '📥 Return'}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(t.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;