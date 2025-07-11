import React, { useState } from 'react';
import { PieChart, LineChart, BarChart } from '../components/charts';
import AnomalyList from '../components/dashboard/AnomalyList';
import DataTable from '../components/data/DataTable';
import { mockRecentAnomalies, mockTrafficData, mockClassDistribution } from '../utils/mockData';
import { getTrafficByProtocol, getTrafficByPorts } from '../utils/dataAnalysis';

const TrafficAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anomalies' | 'statistics' | 'raw'>('anomalies');

  // Prepare data for visualizations
  const protocolData = getTrafficByProtocol(mockTrafficData).map(item => ({
    category: item.protocol,
    value: item.count,
    color: item.protocol === 'TCP' ? '#3b82f6' : 
           item.protocol === 'UDP' ? '#10b981' : 
           item.protocol === 'ICMP' ? '#f59e0b' : '#6366f1'
  }));

  const portData = getTrafficByPorts(mockTrafficData, 10).map(item => ({
    category: `${item.port}`,
    value: item.count
  }));

  const threatData = mockClassDistribution
    .filter(item => item.class !== 'BENIGN')
    .map(item => ({
      category: item.class,
      value: item.count
    }));

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'anomalies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Anomalies
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'statistics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'raw'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Raw Data
          </button>
        </nav>
      </div>

      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <AnomalyList anomalies={mockRecentAnomalies} limit={20} showViewAll={false} />
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-base font-medium text-gray-900">Anomaly Types Distribution</h3>
              </div>
              <div className="flex justify-center p-4">
                <PieChart
                  data={threatData}
                  width={450}
                  height={400}
                  colorScale={[
                    '#ef4444', // DDoS
                    '#8b5cf6', // Botnet 
                    '#f97316', // PortScanning
                    '#eab308', // DataExfiltration
                    '#6366f1', // BruteForce
                    '#ec4899'  // Malware
                  ]}
                />
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-base font-medium text-gray-900">Anomaly Score Distribution</h3>
              </div>
              <div className="flex justify-center p-4">
                <BarChart
                  data={[
                    { category: '0.0-0.2', value: 12 },
                    { category: '0.2-0.4', value: 24 },
                    { category: '0.4-0.6', value: 53 },
                    { category: '0.6-0.8', value: 86 },
                    { category: '0.8-1.0', value: 72 }
                  ]}
                  width={450}
                  height={400}
                  barColor="#ef4444"
                  xAxisLabel="Anomaly Score Range"
                  yAxisLabel="Number of Records"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-base font-medium text-gray-900">Traffic by Protocol</h3>
              </div>
              <div className="flex justify-center p-4">
                <PieChart
                  data={protocolData}
                  width={450}
                  height={400}
                />
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-base font-medium text-gray-900">Traffic by Port (Top 10)</h3>
              </div>
              <div className="flex justify-center p-4">
                <BarChart
                  data={portData}
                  width={450}
                  height={400}
                  barColor="#3b82f6"
                  xAxisLabel="Port"
                  yAxisLabel="Number of Connections"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h3 className="text-base font-medium text-gray-900">Traffic Flow Characteristics</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Flow Duration</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {(mockTrafficData.reduce((sum, item) => sum + item.flowDuration, 0) / mockTrafficData.length).toFixed(2)} ms
                  </p>
                </div>
                
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-500">Avg. Packet Size</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-900">
                    {(mockTrafficData.reduce((sum, item) => sum + item.avgPacketLength, 0) / mockTrafficData.length).toFixed(2)} bytes
                  </p>
                </div>
                
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-500">Avg. Flow Bytes/Sec</p>
                  <p className="mt-1 text-2xl font-semibold text-green-900">
                    {(mockTrafficData.reduce((sum, item) => sum + item.flowBytesPerSecond, 0) / mockTrafficData.length).toFixed(2)} B/s
                  </p>
                </div>
                
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm font-medium text-purple-500">Avg. Packets/Flow</p>
                  <p className="mt-1 text-2xl font-semibold text-purple-900">
                    {(mockTrafficData.reduce((sum, item) => sum + item.totalPackets, 0) / mockTrafficData.length).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <LineChart
                  data={[
                    { date: new Date('2023-01-01'), value: 256 },
                    { date: new Date('2023-01-02'), value: 345 },
                    { date: new Date('2023-01-03'), value: 510 },
                    { date: new Date('2023-01-04'), value: 478 },
                    { date: new Date('2023-01-05'), value: 389 },
                    { date: new Date('2023-01-06'), value: 425 },
                    { date: new Date('2023-01-07'), value: 582 },
                    { date: new Date('2023-01-08'), value: 479 },
                    { date: new Date('2023-01-09'), value: 380 },
                    { date: new Date('2023-01-10'), value: 413 },
                  ]}
                  width={1000}
                  height={300}
                  lineColor="#8b5cf6"
                  xAxisLabel="Date"
                  yAxisLabel="Avg Flow Bytes/Second"
                  title="Average Flow Bytes per Second Over Time"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <DataTable data={mockTrafficData} title="Complete Traffic Data" pageSize={20} />
      )}
    </div>
  );
};

export default TrafficAnalysis;