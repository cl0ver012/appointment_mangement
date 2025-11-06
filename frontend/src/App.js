import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Dashboard from './components/Dashboard';
import AppointmentList from './components/AppointmentList';
import SlotManagement from './components/SlotManagement';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <header className="app-header">
        <div className="container">
          <h1>Healthcare Appointment Management</h1>
          <p>Enterprise Voice AI Integration Demo</p>
        </div>
      </header>

      <div className="container">
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            Slot Management
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard key={refreshKey} onUpdate={handleRefresh} />
          )}
          {activeTab === 'appointments' && (
            <AppointmentList key={refreshKey} onUpdate={handleRefresh} />
          )}
          {activeTab === 'slots' && (
            <SlotManagement key={refreshKey} />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <div className="container">
          <p>© 2025 Healthcare Appointment Management • Voice AI Enabled</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

