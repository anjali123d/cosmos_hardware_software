import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs/:id" element={<LabDetail />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;