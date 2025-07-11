export interface TrafficData {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  flowDuration: number;
  totalBytes: number;
  totalPackets: number;
  avgPacketLength: number;
  minPacketLength: number;
  maxPacketLength: number;
  flowsPerSourceIP: number;
  timeBetweenFlows: number;
  flowBytesPerSecond: number;
  packetInterArrivalTimeMean: number;
  packetInterArrivalTimeStd: number;
  tcpFlags: {
    SYN: boolean;
    ACK: boolean;
    FIN: boolean;
  };
  flowIdleTime: number;
}

export type ThreatClass = 
  | 'BENIGN' 
  | 'DDoS' 
  | 'Botnet'
  | 'PortScanning'
  | 'DataExfiltration'
  | 'BruteForce'
  | 'Malware'
  | 'DoS'
  | 'Phishing';

export type AppCategory =
  | 'WebBrowsing'
  | 'VideoStreaming'
  | 'SocialMedia'
  | 'Email'
  | 'FileTransfer'
  | 'OnlineGaming'
  | 'VoIP'
  | 'CloudServices'
  | 'RemoteAccess'
  | 'DatabaseAccess'
  | 'Unknown';

export interface AppIdentification {
  category: AppCategory;
  appName: string;
  confidence: number;
}

export interface ClassifiedTraffic extends TrafficData {
  classification: ThreatClass;
  confidence: number;
  anomalyScore: number;
  application: AppIdentification;
}

export interface ModelMetrics {
  accuracy: number;
  precision: {
    [key in ThreatClass]: number;
  };
  recall: {
    [key in ThreatClass]: number;
  };
  f1Score: {
    [key in ThreatClass]: number;
  };
  confusionMatrix: {
    actual: ThreatClass;
    predicted: ThreatClass;
    count: number;
  }[];
  appIdentificationAccuracy: {
    [key in AppCategory]: number;
  };
}

export interface ClassDistribution {
  class: ThreatClass;
  count: number;
  percentage: number;
}

export interface AppDistribution {
  category: AppCategory;
  count: number;
  percentage: number;
}

export interface RecentAnomaly {
  id: string;
  timestamp: string;
  classification: ThreatClass;
  sourceIP: string;
  destinationIP: string;
  confidence: number;
  anomalyScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  application: AppIdentification;
}