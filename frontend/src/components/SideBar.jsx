import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FiBarChart2, FiBox, FiGrid, FiList } from 'react-icons/fi';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <FiBox size={28} style={{ marginRight: 8 }} /> Stock Manager
                </div>
                <nav onClick={closeSidebar}>
                    <NavLink to="/" end>
                        <FiBarChart2 size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/items">
                        <FiBox size={20} /> Items / Stock
                    </NavLink>
                    <NavLink to="/labs">
                        <FiGrid size={20} /> Labs
                    </NavLink>
                    <NavLink to="/transactions">
                        <FiList size={20} /> Transactions
                    </NavLink>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;