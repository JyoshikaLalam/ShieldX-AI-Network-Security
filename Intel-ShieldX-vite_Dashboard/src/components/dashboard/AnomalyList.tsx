import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { RecentAnomaly, ThreatClass } from '../../types';

interface AnomalyListProps {
  anomalies: RecentAnomaly[];
  limit?: number;
  showViewAll?: boolean;
}

const getAnomalyIcon = (severity: RecentAnomaly['severity']) => {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="h-5 w-5 text-red-600" />;
    case 'high':
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const getClassColor = (classification: ThreatClass) => {
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

const AnomalyList: React.FC<AnomalyListProps> = ({ 
  anomalies, 
  limit = 5,
  showViewAll = true 
}) => {
  const displayedAnomalies = limit ? anomalies.slice(0, limit) : anomalies;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-base font-medium text-gray-900">Recent Anomalies</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {displayedAnomalies.length > 0 ? (
          displayedAnomalies.map((anomaly) => (
            <li key={anomaly.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getAnomalyIcon(anomaly.severity)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {anomaly.sourceIP} → {anomaly.destinationIP}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getClassColor(anomaly.classification)}`}>
                        {anomaly.classification}
                      </span>
                      {anomaly.application && (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getAppColor(anomaly.application.confidence)}`}>
                          {anomaly.application.appName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(anomaly.timestamp).toLocaleString()}
                      {' · '}
                      Score: {anomaly.anomalyScore.toFixed(2)}
                      {anomaly.application && (
                        <>
                          {' · '}
                          App Category: {anomaly.application.category}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {Math.round(anomaly.confidence * 100)}% confidence
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No anomalies detected</li>
        )}
      </ul>
      {showViewAll && anomalies.length > limit && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center">
          <Link to="/traffic-analysis" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all anomalies →
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnomalyList;