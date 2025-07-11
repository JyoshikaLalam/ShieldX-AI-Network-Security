import { ClassifiedTraffic, ThreatClass, AppCategory, AppIdentification } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random IP address
const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Function to randomly select an item from an array
const randomSelect = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Application signatures for different categories
const applicationSignatures: Record<AppCategory, string[]> = {
  WebBrowsing: ['Chrome', 'Firefox', 'Safari', 'Edge'],
  VideoStreaming: ['Netflix', 'YouTube', 'Prime Video', 'Disney+', 'Twitch'],
  SocialMedia: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'],
  Email: ['Gmail', 'Outlook', 'Yahoo Mail', 'ProtonMail'],
  FileTransfer: ['Dropbox', 'Google Drive', 'OneDrive', 'FTP Client'],
  OnlineGaming: ['Steam', 'Epic Games', 'Battle.net', 'League of Legends'],
  VoIP: ['Skype', 'Zoom', 'Discord', 'Teams'],
  CloudServices: ['AWS', 'Azure', 'Google Cloud', 'Salesforce'],
  RemoteAccess: ['SSH', 'RDP', 'TeamViewer', 'AnyDesk'],
  DatabaseAccess: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  Unknown: ['Unknown Application']
};

// Function to generate application identification based on port and protocol
const generateAppIdentification = (port: number, protocol: string): AppIdentification => {
  let category: AppCategory;
  let confidence = Math.random() * 0.2 + 0.8; // Base confidence between 0.8 and 1.0

  // Determine category based on common ports and protocols
  switch (true) {
    case port === 80 || port === 443:
      category = Math.random() < 0.7 ? 'WebBrowsing' : 'SocialMedia';
      break;
    case port === 25 || port === 587 || port === 465 || port === 993:
      category = 'Email';
      break;
    case port === 21 || port === 22:
      category = 'FileTransfer';
      break;
    case port >= 27015 && port <= 27030:
      category = 'OnlineGaming';
      break;
    case port === 3389 || port === 5900:
      category = 'RemoteAccess';
      break;
    case port === 3306 || port === 5432 || port === 27017:
      category = 'DatabaseAccess';
      break;
    case [5060, 5061].includes(port):
      category = 'VoIP';
      break;
    case port >= 1935 && port <= 1940:
      category = 'VideoStreaming';
      break;
    default:
      if (Math.random() < 0.3) {
        category = randomSelect([
          'WebBrowsing', 'VideoStreaming', 'SocialMedia', 'CloudServices'
        ] as AppCategory[]);
      } else {
        category = 'Unknown';
        confidence = Math.random() * 0.3 + 0.5; // Lower confidence for unknown applications
      }
  }

  return {
    category,
    appName: randomSelect(applicationSignatures[category]),
    confidence
  };
};

// Function to generate random traffic data
export const generateMockTrafficData = (count: number): ClassifiedTraffic[] => {
  const data: ClassifiedTraffic[] = [];
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SMTP'];
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080];
  const threatClasses: ThreatClass[] = [
    'BENIGN', 'DDoS', 'Botnet', 'PortScanning', 'DataExfiltration', 'BruteForce', 'Malware', 'DoS', 'Phishing'
  ];
  
  // Probability distribution for different classes (BENIGN should be the most common)
  const classProbabilities: Record<ThreatClass, number> = {
    'BENIGN': 0.6, // 60% of the data
    'DDoS': 0.08,
    'Botnet': 0.06,
    'PortScanning': 0.05,
    'DataExfiltration': 0.04,
    'BruteForce': 0.05,
    'Malware': 0.04,
    'DoS': 0.05,
    'Phishing': 0.03,
  };

  // Timestamp base (30 days ago)
  const baseTimestamp = new Date();
  baseTimestamp.setDate(baseTimestamp.getDate() - 30);
  
  for (let i = 0; i < count; i++) {
    // Determine classification based on probabilities
    let classification: ThreatClass = 'BENIGN';
    const rand = Math.random();
    let cumulativeProbability = 0;
    
    for (const [cls, probability] of Object.entries(classProbabilities)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        classification = cls as ThreatClass;
        break;
      }
    }
    
    // Generate random timestamp within the last 30 days
    const timestamp = new Date(baseTimestamp.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    // Generate a random port or common port
    const useCommonPort = Math.random() < 0.7; // 70% chance of using a common port
    const destinationPort = useCommonPort 
      ? randomSelect(commonPorts) 
      : Math.floor(Math.random() * 65536);
    
    const protocol = randomSelect(protocols);
    
    // Set different characteristics based on classification
    let flowDuration = 0;
    let totalBytes = 0;
    let avgPacketLength = 0;
    let totalPackets = 0;
    let flowBytesPerSecond = 0;
    let packetInterArrivalTimeMean = 0;
    let anomalyScore = 0;
    
    switch (classification) {
      case 'BENIGN':
        flowDuration = Math.random() * 500 + 10;
        totalBytes = Math.floor(Math.random() * 10000 + 100);
        avgPacketLength = Math.floor(Math.random() * 500 + 100);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.2; // Low anomaly score for benign
        break;
        
      case 'DDoS':
        flowDuration = Math.random() * 100 + 5;
        totalBytes = Math.floor(Math.random() * 50000 + 20000);
        avgPacketLength = Math.floor(Math.random() * 200 + 50);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.7; // High anomaly score
        break;
        
      case 'Botnet':
        flowDuration = Math.random() * 1000 + 100;
        totalBytes = Math.floor(Math.random() * 5000 + 500);
        avgPacketLength = Math.floor(Math.random() * 300 + 100);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.6;
        break;
        
      case 'PortScanning':
        flowDuration = Math.random() * 200 + 5;
        totalBytes = Math.floor(Math.random() * 1000 + 50);
        avgPacketLength = Math.floor(Math.random() * 100 + 40);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.5;
        break;
        
      case 'DataExfiltration':
        flowDuration = Math.random() * 1000 + 200;
        totalBytes = Math.floor(Math.random() * 100000 + 50000);
        avgPacketLength = Math.floor(Math.random() * 1000 + 500);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.6;
        break;
        
      case 'BruteForce':
        flowDuration = Math.random() * 500 + 50;
        totalBytes = Math.floor(Math.random() * 3000 + 200);
        avgPacketLength = Math.floor(Math.random() * 200 + 80);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.5;
        break;
        
      case 'Malware':
        flowDuration = Math.random() * 800 + 100;
        totalBytes = Math.floor(Math.random() * 20000 + 1000);
        avgPacketLength = Math.floor(Math.random() * 400 + 100);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.6;
        break;
        
      case 'DoS':
        flowDuration = Math.random() * 300 + 5;
        totalBytes = Math.floor(Math.random() * 40000 + 15000);
        avgPacketLength = Math.floor(Math.random() * 300 + 100);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.6;
        break;
        
      case 'Phishing':
        flowDuration = Math.random() * 400 + 50;
        totalBytes = Math.floor(Math.random() * 8000 + 500);
        avgPacketLength = Math.floor(Math.random() * 500 + 100);
        totalPackets = Math.floor(totalBytes / avgPacketLength);
        flowBytesPerSecond = totalBytes / (flowDuration / 1000);
        packetInterArrivalTimeMean = flowDuration / totalPackets;
        anomalyScore = Math.random() * 0.3 + 0.5;
        break;
    }

    // Generate application identification
    const application = generateAppIdentification(destinationPort, protocol);
    
    data.push({
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      sourceIP: generateRandomIP(),
      destinationIP: generateRandomIP(),
      sourcePort: Math.floor(Math.random() * 65536),
      destinationPort,
      protocol,
      flowDuration,
      totalBytes,
      totalPackets,
      avgPacketLength,
      minPacketLength: Math.floor(avgPacketLength * (0.5 + Math.random() * 0.3)),
      maxPacketLength: Math.floor(avgPacketLength * (1.2 + Math.random() * 0.5)),
      flowsPerSourceIP: Math.floor(Math.random() * 10 + 1),
      timeBetweenFlows: Math.random() * 500 + 10,
      flowBytesPerSecond,
      packetInterArrivalTimeMean,
      packetInterArrivalTimeStd: packetInterArrivalTimeMean * (Math.random() * 0.5 + 0.1),
      tcpFlags: {
        SYN: Math.random() < 0.3,
        ACK: Math.random() < 0.7,
        FIN: Math.random() < 0.2,
      },
      flowIdleTime: Math.random() * 1000 + 10,
      classification,
      confidence: Math.random() * 0.2 + 0.8, // High confidence in classification
      anomalyScore,
      application,
    });
  }
  
  return data;
};

// Function to generate traffic trend data
export const getTrafficTrendData = (days: number): { date: Date; value: number }[] => {
  const data: { date: Date; value: number }[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - i - 1));
    
    // Base value with random fluctuation
    let value = 300 + Math.random() * 200;
    
    // Add a weekly pattern (higher on weekdays)
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      value += 100 + Math.random() * 50;
    }
    
    // Add an overall upward trend
    value += i * (Math.random() * 4 + 1);
    
    data.push({ date, value });
  }
  
  return data;
};