import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import DoctorDashboard from './components/DoctorDashboard';

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        theme="light"
      />
      
      <header className="app-header">
        <div className="container">
          <h1>Appointment Management System</h1>
          <p>Voice AI Integration Platform</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <DoctorDashboard />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Healthcare Appointment Management • API-Driven</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

