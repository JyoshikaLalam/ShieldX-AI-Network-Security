# NetSecAI API Documentation

## Traffic Analysis API

### Get Traffic Statistics
```typescript
interface TrafficStats {
  totalFlows: number;
  avgFlowDuration: number;
  avgPacketLength: number;
  avgFlowBytes: number;
  avgPacketsPerFlow: number;
}

GET /api/traffic/stats
```

### Get Traffic Classification
```typescript
interface Classification {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  classification: string;
  confidence: number;
}

GET /api/traffic/classification
```

### Get Anomaly Detection
```typescript
interface Anomaly {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  details: object;
}

GET /api/anomalies
```

## Application Analysis API

### Get Application Distribution
```typescript
interface AppDistribution {
  category: string;
  count: number;
  percentage: number;
}

GET /api/applications/distribution
```

### Get Application Performance
```typescript
interface AppPerformance {
  appName: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

GET /api/applications/performance
```

## Model Performance API

### Get Model Metrics
```typescript
interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

GET /api/model/metrics
```