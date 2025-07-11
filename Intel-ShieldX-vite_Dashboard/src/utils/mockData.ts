import { ClassifiedTraffic, ThreatClass, RecentAnomaly, ModelMetrics, ClassDistribution } from '../types';
import { generateMockTrafficData } from './dataGenerator';

// Generate mock traffic data (500+ records)
export const mockTrafficData: ClassifiedTraffic[] = generateMockTrafficData(500);

// Extract recent anomalies from the traffic data
export const mockRecentAnomalies: RecentAnomaly[] = mockTrafficData
  .filter(item => item.classification !== 'BENIGN')
  .slice(0, 20)
  .map(item => ({
    id: item.id,
    timestamp: item.timestamp,
    classification: item.classification,
    sourceIP: item.sourceIP,
    destinationIP: item.destinationIP,
    confidence: item.confidence,
    anomalyScore: item.anomalyScore,
    severity: 
      item.anomalyScore > 0.8 ? 'critical' :
      item.anomalyScore > 0.6 ? 'high' :
      item.anomalyScore > 0.4 ? 'medium' : 'low'
  }));

// Calculate class distribution
export const mockClassDistribution: ClassDistribution[] = (() => {
  const classes = new Map<ThreatClass, number>();
  
  mockTrafficData.forEach(item => {
    const count = classes.get(item.classification) || 0;
    classes.set(item.classification, count + 1);
  });
  
  const total = mockTrafficData.length;
  return Array.from(classes.entries()).map(([cls, count]) => ({
    class: cls,
    count,
    percentage: count / total
  }));
})();

// Mock model metrics
export const mockModelMetrics: ModelMetrics = {
  accuracy: 0.936,
  precision: {
    'BENIGN': 0.982,
    'DDoS': 0.957,
    'Botnet': 0.892,
    'PortScanning': 0.913,
    'DataExfiltration': 0.887,
    'BruteForce': 0.904,
    'Malware': 0.876,
    'DoS': 0.925,
    'Phishing': 0.863
  },
  recall: {
    'BENIGN': 0.976,
    'DDoS': 0.931,
    'Botnet': 0.871,
    'PortScanning': 0.893,
    'DataExfiltration': 0.842,
    'BruteForce': 0.888,
    'Malware': 0.852,
    'DoS': 0.913,
    'Phishing': 0.829
  },
  f1Score: {
    'BENIGN': 0.979,
    'DDoS': 0.944,
    'Botnet': 0.881,
    'PortScanning': 0.903,
    'DataExfiltration': 0.864,
    'BruteForce': 0.896,
    'Malware': 0.864,
    'DoS': 0.919,
    'Phishing': 0.846
  },
  confusionMatrix: [
    { actual: 'BENIGN', predicted: 'BENIGN', count: 250 },
    { actual: 'BENIGN', predicted: 'DDoS', count: 3 },
    { actual: 'BENIGN', predicted: 'Botnet', count: 2 },
    { actual: 'BENIGN', predicted: 'PortScanning', count: 1 },
    { actual: 'BENIGN', predicted: 'DataExfiltration', count: 0 },
    { actual: 'BENIGN', predicted: 'BruteForce', count: 0 },
    { actual: 'BENIGN', predicted: 'Malware', count: 0 },
    { actual: 'BENIGN', predicted: 'DoS', count: 0 },
    { actual: 'BENIGN', predicted: 'Phishing', count: 0 },
    
    { actual: 'DDoS', predicted: 'BENIGN', count: 1 },
    { actual: 'DDoS', predicted: 'DDoS', count: 42 },
    { actual: 'DDoS', predicted: 'Botnet', count: 0 },
    { actual: 'DDoS', predicted: 'PortScanning', count: 1 },
    { actual: 'DDoS', predicted: 'DataExfiltration', count: 0 },
    { actual: 'DDoS', predicted: 'BruteForce', count: 0 },
    { actual: 'DDoS', predicted: 'Malware', count: 0 },
    { actual: 'DDoS', predicted: 'DoS', count: 1 },
    { actual: 'DDoS', predicted: 'Phishing', count: 0 },
    
    { actual: 'Botnet', predicted: 'BENIGN', count: 0 },
    { actual: 'Botnet', predicted: 'DDoS', count: 1 },
    { actual: 'Botnet', predicted: 'Botnet', count: 28 },
    { actual: 'Botnet', predicted: 'PortScanning', count: 0 },
    { actual: 'Botnet', predicted: 'DataExfiltration', count: 1 },
    { actual: 'Botnet', predicted: 'BruteForce', count: 0 },
    { actual: 'Botnet', predicted: 'Malware', count: 1 },
    { actual: 'Botnet', predicted: 'DoS', count: 0 },
    { actual: 'Botnet', predicted: 'Phishing', count: 1 },
    
    { actual: 'PortScanning', predicted: 'BENIGN', count: 1 },
    { actual: 'PortScanning', predicted: 'DDoS', count: 0 },
    { actual: 'PortScanning', predicted: 'Botnet', count: 0 },
    { actual: 'PortScanning', predicted: 'PortScanning', count: 25 },
    { actual: 'PortScanning', predicted: 'DataExfiltration', count: 2 },
    { actual: 'PortScanning', predicted: 'BruteForce', count: 0 },
    { actual: 'PortScanning', predicted: 'Malware', count: 0 },
    { actual: 'PortScanning', predicted: 'DoS', count: 0 },
    { actual: 'PortScanning', predicted: 'Phishing', count: 0 },
    
    { actual: 'DataExfiltration', predicted: 'BENIGN', count: 0 },
    { actual: 'DataExfiltration', predicted: 'DDoS', count: 0 },
    { actual: 'DataExfiltration', predicted: 'Botnet', count: 1 },
    { actual: 'DataExfiltration', predicted: 'PortScanning', count: 1 },
    { actual: 'DataExfiltration', predicted: 'DataExfiltration', count: 16 },
    { actual: 'DataExfiltration', predicted: 'BruteForce', count: 0 },
    { actual: 'DataExfiltration', predicted: 'Malware', count: 1 },
    { actual: 'DataExfiltration', predicted: 'DoS', count: 0 },
    { actual: 'DataExfiltration', predicted: 'Phishing', count: 0 },
    
    { actual: 'BruteForce', predicted: 'BENIGN', count: 0 },
    { actual: 'BruteForce', predicted: 'DDoS', count: 0 },
    { actual: 'BruteForce', predicted: 'Botnet', count: 0 },
    { actual: 'BruteForce', predicted: 'PortScanning', count: 0 },
    { actual: 'BruteForce', predicted: 'DataExfiltration', count: 0 },
    { actual: 'BruteForce', predicted: 'BruteForce', count: 20 },
    { actual: 'BruteForce', predicted: 'Malware', count: 1 },
    { actual: 'BruteForce', predicted: 'DoS', count: 1 },
    { actual: 'BruteForce', predicted: 'Phishing', count: 0 },
    
    { actual: 'Malware', predicted: 'BENIGN', count: 0 },
    { actual: 'Malware', predicted: 'DDoS', count: 0 },
    { actual: 'Malware', predicted: 'Botnet', count: 1 },
    { actual: 'Malware', predicted: 'PortScanning', count: 0 },
    { actual: 'Malware', predicted: 'DataExfiltration', count: 1 },
    { actual: 'Malware', predicted: 'BruteForce', count: 1 },
    { actual: 'Malware', predicted: 'Malware', count: 18 },
    { actual: 'Malware', predicted: 'DoS', count: 0 },
    { actual: 'Malware', predicted: 'Phishing', count: 0 },
    
    { actual: 'DoS', predicted: 'BENIGN', count: 0 },
    { actual: 'DoS', predicted: 'DDoS', count: 1 },
    { actual: 'DoS', predicted: 'Botnet', count: 0 },
    { actual: 'DoS', predicted: 'PortScanning', count: 0 },
    { actual: 'DoS', predicted: 'DataExfiltration', count: 0 },
    { actual: 'DoS', predicted: 'BruteForce', count: 0 },
    { actual: 'DoS', predicted: 'Malware', count: 0 },
    { actual: 'DoS', predicted: 'DoS', count: 21 },
    { actual: 'DoS', predicted: 'Phishing', count: 1 },
    
    { actual: 'Phishing', predicted: 'BENIGN', count: 0 },
    { actual: 'Phishing', predicted: 'DDoS', count: 0 },
    { actual: 'Phishing', predicted: 'Botnet', count: 1 },
    { actual: 'Phishing', predicted: 'PortScanning', count: 0 },
    { actual: 'Phishing', predicted: 'DataExfiltration', count: 0 },
    { actual: 'Phishing', predicted: 'BruteForce', count: 1 },
    { actual: 'Phishing', predicted: 'Malware', count: 1 },
    { actual: 'Phishing', predicted: 'DoS', count: 0 },
    { actual: 'Phishing', predicted: 'Phishing', count: 15 },
  ]
};