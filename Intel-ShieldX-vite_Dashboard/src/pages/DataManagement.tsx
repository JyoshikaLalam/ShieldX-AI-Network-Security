import React from 'react';
import { Database } from 'lucide-react';
import DataTable from '../components/data/DataTable';
import { mockTrafficData } from '../utils/mockData';

const DataManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Network Traffic Dataset</h3>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-500">
              This dataset contains detailed network traffic information including traffic patterns,
              application types, and security classifications. Use the table below to explore and
              analyze the data.
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Data Summary</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center">
                  <Database className="mr-3 h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Total Records</span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-blue-900">{mockTrafficData.length}</p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center">
                  <Database className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">BENIGN Traffic</span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-green-900">
                  {mockTrafficData.filter(item => item.classification === 'BENIGN').length}
                </p>
              </div>

              <button
                onClick={() => {
                  const headers = Object.keys(mockTrafficData[0]).join(',');
                  const rows = mockTrafficData.map(item => {
                    return Object.values(item).map(value => {
                      if (typeof value === 'object') {
                        return JSON.stringify(value);
                      }
                      return value;
                    }).join(',');
                  });
                  
                  const csvContent = [headers, ...rows].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `network_traffic_data_${new Date().toISOString().slice(0, 10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Download Dataset
              </button>
            </div>
          </div>
        </div>
      </div>

      <DataTable data={mockTrafficData} title="Network Traffic Dataset" pageSize={10} />
    </div>
  );
};

export default DataManagement;