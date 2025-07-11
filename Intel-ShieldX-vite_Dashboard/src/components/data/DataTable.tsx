import React, { useState } from 'react';
import { ClassifiedTraffic, ThreatClass } from '../../types';

interface DataTableProps {
  data: ClassifiedTraffic[];
  title?: string;
  pageSize?: number;
}

const getClassificationColor = (classification: ThreatClass) => {
  switch (classification) {
    case 'BENIGN':
      return 'bg-green-100 text-green-800';
    case 'DDoS':
    case 'Malware':
      return 'bg-red-100 text-red-800';
    case 'Botnet':
    case 'BruteForce':
      return 'bg-purple-100 text-purple-800';
    case 'PortScanning':
      return 'bg-orange-100 text-orange-800';
    case 'DataExfiltration':
      return 'bg-yellow-100 text-yellow-800';
    case 'DoS':
      return 'bg-pink-100 text-pink-800';
    case 'Phishing':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAppColor = (confidence: number) => {
  if (confidence >= 0.9) return 'bg-green-100 text-green-800';
  if (confidence >= 0.7) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  title = 'Network Traffic Data',
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ClassifiedTraffic>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState<ThreatClass | 'ALL'>('ALL');

  // Get unique classification values
  const classifications = ['ALL', ...Array.from(new Set(data.map(item => item.classification)))];

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.sourceIP.includes(searchTerm) || 
      item.destinationIP.includes(searchTerm) ||
      item.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.application.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.application.appName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClassification = 
      filterClassification === 'ALL' || 
      item.classification === filterClassification;
    
    return matchesSearch && matchesClassification;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pageData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: keyof ClassifiedTraffic) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
      </div>

      <div className="flex flex-col space-y-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex w-full max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="classification-filter" className="text-sm font-medium text-gray-700">
            Classification:
          </label>
          <select
            id="classification-filter"
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={filterClassification}
            onChange={(e) => {
              setFilterClassification(e.target.value as ThreatClass | 'ALL');
              setCurrentPage(1);
            }}
          >
            {classifications.map((classification) => (
              <option key={classification} value={classification}>
                {classification}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex cursor-pointer items-center">
                  Timestamp
                  {sortField === 'timestamp' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('sourceIP')}
              >
                <div className="flex cursor-pointer items-center">
                  Source IP
                  {sortField ===
                    'sourceIP' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('destinationIP')}
              >
                <div className="flex cursor-pointer items-center">
                  Destination IP
                  {sortField === 'destinationIP' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('protocol')}
              >
                <div className="flex cursor-pointer items-center">
                  Protocol
                  {sortField === 'protocol' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <div className="flex cursor-pointer items-center">
                  Application
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('totalBytes')}
              >
                <div className="flex cursor-pointer items-center">
                  Total Bytes
                  {sortField === 'totalBytes' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('classification')}
              >
                <div className="flex cursor-pointer items-center">
                  Classification
                  {sortField === 'classification' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex cursor-pointer items-center">
                  Confidence
                  {sortField === 'confidence' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pageData.length > 0 ? (
              pageData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.sourceIP}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.destinationIP}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.protocol}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getAppColor(item.application.confidence)}`}>
                        {item.application.appName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.application.category}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.totalBytes.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getClassificationColor(item.classification)}`}>
                      {item.classification}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {Math.round(item.confidence * 100)}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;