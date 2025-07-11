import { ClassifiedTraffic } from '../types';

// Analyze traffic by protocol
export const getTrafficByProtocol = (data: ClassifiedTraffic[]) => {
  const protocolCounts: Map<string, number> = new Map();
  
  data.forEach(item => {
    const protocol = item.protocol;
    protocolCounts.set(protocol, (protocolCounts.get(protocol) || 0) + 1);
  });
  
  return Array.from(protocolCounts.entries())
    .map(([protocol, count]) => ({ protocol, count }))
    .sort((a, b) => b.count - a.count);
};

// Analyze traffic by port (top N)
export const getTrafficByPorts = (data: ClassifiedTraffic[], topN: number = 10) => {
  const portCounts: Map<number, number> = new Map();
  
  data.forEach(item => {
    const port = item.destinationPort;
    portCounts.set(port, (portCounts.get(port) || 0) + 1);
  });
  
  return Array.from(portCounts.entries())
    .map(([port, count]) => ({ port, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

// Calculate traffic statistics
export const calculateTrafficStatistics = (data: ClassifiedTraffic[]) => {
  if (data.length === 0) {
    return {
      totalFlows: 0,
      avgFlowDuration: 0,
      avgPacketLength: 0,
      avgFlowBytes: 0,
      avgPacketsPerFlow: 0,
    };
  }
  
  const totalFlows = data.length;
  const avgFlowDuration = data.reduce((sum, item) => sum + item.flowDuration, 0) / totalFlows;
  const avgPacketLength = data.reduce((sum, item) => sum + item.avgPacketLength, 0) / totalFlows;
  const avgFlowBytes = data.reduce((sum, item) => sum + item.totalBytes, 0) / totalFlows;
  const avgPacketsPerFlow = data.reduce((sum, item) => sum + item.totalPackets, 0) / totalFlows;
  
  return {
    totalFlows,
    avgFlowDuration,
    avgPacketLength,
    avgFlowBytes,
    avgPacketsPerFlow,
  };
};

// Analyze traffic by classification
export const getTrafficByClassification = (data: ClassifiedTraffic[]) => {
  const classCounts: Map<string, number> = new Map();
  
  data.forEach(item => {
    const classification = item.classification;
    classCounts.set(classification, (classCounts.get(classification) || 0) + 1);
  });
  
  return Array.from(classCounts.entries())
    .map(([classification, count]) => ({ classification, count }))
    .sort((a, b) => b.count - a.count);
};

// Calculate anomaly statistics
export const calculateAnomalyStatistics = (data: ClassifiedTraffic[]) => {
  const anomalies = data.filter(item => item.classification !== 'BENIGN');
  
  if (anomalies.length === 0) {
    return {
      anomalyCount: 0,
      anomalyPercentage: 0,
      avgAnomalyScore: 0,
      highRiskCount: 0,
    };
  }
  
  const anomalyCount = anomalies.length;
  const anomalyPercentage = (anomalyCount / data.length) * 100;
  const avgAnomalyScore = anomalies.reduce((sum, item) => sum + item.anomalyScore, 0) / anomalyCount;
  const highRiskCount = anomalies.filter(item => item.anomalyScore > 0.7).length;
  
  return {
    anomalyCount,
    anomalyPercentage,
    avgAnomalyScore,
    highRiskCount,
  };
};