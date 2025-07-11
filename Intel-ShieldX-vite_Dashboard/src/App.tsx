import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ModelMetrics from './pages/ModelMetrics';
import DataManagement from './pages/DataManagement';
import TrafficAnalysis from './pages/TrafficAnalysis';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/model-metrics" element={<ModelMetrics />} />
          <Route path="/data-management" element={<DataManagement />} />
          <Route path="/traffic-analysis" element={<TrafficAnalysis />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;