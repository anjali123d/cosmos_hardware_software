import axios from 'axios';

const API_BASE_URL = 'https://cosmos-hardware-software.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Items
export const getItems = () => api.get('/items');
export const addItem = (itemData) => api.post('/items', itemData);

// Labs
export const getLabs = () => api.get('/labs');
export const addLab = (labData) => api.post('/labs', labData);

// Transactions
export const getTransactions = () => api.get('/transactions');
export const issueItem = (data) => api.post('/transactions/issue', data);
export const returnItem = (data) => api.post('/transactions/return', data);

// Helper to ensure "Central Store" lab exists (for stock adjustments)
export const ensureCentralStore = async () => {
    try {
        const { data: labs } = await getLabs();
        const central = labs.find(lab => lab.name === "Central Store");
        if (!central) {
            const newLab = await addLab({ name: "Central Store", location: "Main Warehouse" });
            return newLab.data;
        }
        return central;
    } catch (error) {
        console.error("Failed to ensure Central Store:", error);
        return null;
    }
};