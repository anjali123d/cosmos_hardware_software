import React, { createContext, useState, useContext, useEffect } from 'react';
import { getItems, getLabs, getTransactions } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [labs, setLabs] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [itemsRes, labsRes, transRes] = await Promise.all([
                getItems(),
                getLabs(),
                getTransactions()
            ]);
            setItems(itemsRes.data);
            setLabs(labsRes.data);
            setTransactions(transRes.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const refresh = () => fetchAllData();

    return (
        <AppContext.Provider value={{ items, labs, transactions, loading, error, refresh }}>
            {children}
        </AppContext.Provider>
    );
};