import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ContractDeployment from './pages/ContractDeployment';
import VulnerabilityDetection from './pages/VulnerabilityDetection';
import TransactionMonitoring from './pages/TransactionMonitoring';
import AuditReports from './pages/AuditReports';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/*"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/dashboard\" element={<Dashboard />} />
                    <Route path="/deploy" element={<ContractDeployment />} />
                    <Route path="/analyze" element={<VulnerabilityDetection />} />
                    <Route path="/monitor" element={<TransactionMonitoring />} />
                    <Route path="/reports" element={<AuditReports />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;