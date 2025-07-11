import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Zap, BarChart } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import AnomalyList from '../components/dashboard/AnomalyList';
import { BarChart as BarChartComponent } from '../components/charts';
import { PieChart as PieChartComponent } from '../components/charts';
import { LineChart as LineChartComponent } from '../components/charts';
import { mockRecentAnomalies, mockClassDistribution, mockTrafficData } from '../utils/mockData';
import { getTrafficTrendData } from '../utils/dataGenerator';

const Dashboard: React.FC = () => {
  const [trafficTrend, setTrafficTrend] = useState<{ date: Date; value: number }[]>([]);

  useEffect(() => {
    // Simulating data fetching
    setTrafficTrend(getTrafficTrendData(30));
  }, []);

  // Calculate application distribution
  const appDistribution = (() => {
    const appCounts = new Map<string, number>();
    mockTrafficData.forEach(item => {
      const category = item.application.category;
      appCounts.set(category, (appCounts.get(category) || 0) + 1);
    });
    return Array.from(appCounts.entries()).map(([category, count]) => ({
      category,
      value: count
    }));
  })();

  // Calculate app confidence distribution
  const appConfidenceDistribution = (() => {
    const confidenceBins = {
      '90-100%': 0,
      '80-90%': 0,
      '70-80%': 0,
      '60-70%': 0,
      '<60%': 0
    };
    
    mockTrafficData.forEach(item => {
      const confidence = item.application.confidence * 100;
      if (confidence >= 90) confidenceBins['90-100%']++;
      else if (confidence >= 80) confidenceBins['80-90%']++;
      else if (confidence >= 70) confidenceBins['70-80%']++;
      else if (confidence >= 60) confidenceBins['60-70%']++;
      else confidenceBins['<60%']++;
    });

    return Object.entries(confidenceBins).map(([range, count]) => ({
      category: range,
      value: count
    }));
  })();

  const categoryData = mockClassDistribution.map(item => ({
    category: item.class,
    value: item.count
  }));

  const threatDistribution = mockClassDistribution
    .filter(item => item.class !== 'BENIGN')
    .map(item => ({
      category: item.class,
      value: item.count
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Traffic Analyzed"
          value="1.2M"
          icon={<Shield className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          colorClass="bg-blue-600"
        />
        <MetricCard
          title="Anomalies Detected"
          value="247"
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{ value: 5, isPositive: false }}
          colorClass="bg-red-500"
        />
        <MetricCard
          title="Avg. Response Time"
          value="28ms"
          icon={<Zap className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
          colorClass="bg-green-500"
        />
        <MetricCard
          title="Detection Accuracy"
          value="97.8%"
          icon={<BarChart className="h-6 w-6" />}
          trend={{ value: 2.3, isPositive: true }}
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Application Type Distribution</h3>
          </div>
          <div className="flex justify-center p-4">
            <PieChartComponent
              data={appDistribution}
              width={450}
              height={400}
              colorScale={[
                '#3b82f6', // WebBrowsing
                '#ef4444', // VideoStreaming
                '#f59e0b', // SocialMedia
                '#10b981', // Email
                '#6366f1', // FileTransfer
                '#8b5cf6', // OnlineGaming
                '#ec4899', // VoIP
                '#14b8a6', // CloudServices
                '#f97316', // RemoteAccess
                '#6b7280', // DatabaseAccess
                '#94a3b8', // Unknown
              ]}
              title="Traffic by Application Type"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Application Detection Confidence</h3>
          </div>
          <div className="flex justify-center p-4">
            <BarChartComponent
              data={appConfidenceDistribution}
              width={450}
              height={400}
              barColor="#3b82f6"
              highlightColor="#1d4ed8"
              xAxisLabel="Confidence Range"
              yAxisLabel="Number of Flows"
              title="Application Detection Confidence Distribution"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow xl:col-span-2">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Traffic Trend (Last 30 Days)</h3>
          </div>
          <div className="p-4">
            <LineChartComponent
              data={trafficTrend}
              width={800}
              height={300}
              lineColor="#2563eb"
              xAxisLabel="Date"
              yAxisLabel="Traffic Volume"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Traffic Classification</h3>
          </div>
          <div className="flex justify-center p-4">
            <PieChartComponent
              data={categoryData}
              width={320}
              height={320}
              colorScale={[
                '#10b981', // BENIGN
                '#ef4444', // DDoS
                '#8b5cf6', // Botnet 
                '#f97316', // PortScanning
                '#eab308', // DataExfiltration
                '#6366f1', // BruteForce
                '#ec4899'  // Malware
              ]}
              title="Traffic Classes"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnomalyList anomalies={mockRecentAnomalies} />
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Threat Distribution</h3>
          </div>
          <div className="p-4">
            <BarChartComponent
              data={threatDistribution}
              width={320}
              height={250}
              barColor="#ef4444"
              highlightColor="#b91c1c"
              xAxisLabel="Threat Type"
              yAxisLabel="Count"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/model-metrics"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Full Model Performance →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;