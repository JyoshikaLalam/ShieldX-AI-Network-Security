import React, { useEffect, useState } from 'react';
import ModelCard from '../components/model/ModelCard';
import { HeatMap } from '../components/charts';
import { BarChart } from '../components/charts';
import { ModelMetrics, ThreatClass } from '../types';
import { mockModelMetrics } from '../utils/mockData';

const MetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setMetrics(mockModelMetrics);
    }, 300);
  }, []);

  if (!metrics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare data for confusion matrix heatmap
  const confusionMatrixData = metrics.confusionMatrix.map(item => ({
    x: item.predicted,
    y: item.actual,
    value: item.count
  }));

  // Prepare precision, recall and F1 data for bar charts
  const classes = Object.keys(metrics.precision) as ThreatClass[];
  
  const precisionData = classes.map(cls => ({
    category: cls,
    value: metrics.precision[cls]
  }));
  
  const recallData = classes.map(cls => ({
    category: cls,
    value: metrics.recall[cls]
  }));
  
  const f1Data = classes.map(cls => ({
    category: cls,
    value: metrics.f1Score[cls]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ModelCard
          name="Accuracy"
          metric="Overall Accuracy"
          value={metrics.accuracy}
          description="The proportion of correct predictions among the total number of cases examined."
          thresholds={{ low: 0.7, medium: 0.85, high: 0.95 }}
        />
        
        <ModelCard
          name="Average Precision"
          metric="Precision"
          value={
            Object.values(metrics.precision).reduce((sum, val) => sum + val, 0) / 
            Object.values(metrics.precision).length
          }
          description="The ability of the model to avoid labeling negative samples as positive."
          thresholds={{ low: 0.7, medium: 0.85, high: 0.95 }}
        />
        
        <ModelCard
          name="Average Recall"
          metric="Recall"
          value={
            Object.values(metrics.recall).reduce((sum, val) => sum + val, 0) / 
            Object.values(metrics.recall).length
          }
          description="The ability of the model to find all positive samples."
          thresholds={{ low: 0.7, medium: 0.85, high: 0.95 }}
        />
        
        <ModelCard
          name="Average F1 Score"
          metric="F1 Score"
          value={
            Object.values(metrics.f1Score).reduce((sum, val) => sum + val, 0) / 
            Object.values(metrics.f1Score).length
          }
          description="The harmonic mean of precision and recall, providing a balance between them."
          thresholds={{ low: 0.7, medium: 0.85, high: 0.95 }}
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-base font-medium text-gray-900">Confusion Matrix</h3>
        </div>
        <div className="flex justify-center p-4">
          <HeatMap
            data={confusionMatrixData}
            width={800}
            height={600}
            title="Confusion Matrix (Actual vs Predicted)"
            colorScale={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Precision by Class</h3>
          </div>
          <div className="p-4">
            <BarChart
              data={precisionData}
              width={400}
              height={300}
              barColor="#3b82f6"
              xAxisLabel="Class"
              yAxisLabel="Precision"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Recall by Class</h3>
          </div>
          <div className="p-4">
            <BarChart
              data={recallData}
              width={400}
              height={300}
              barColor="#10b981"
              xAxisLabel="Class"
              yAxisLabel="Recall"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">F1 Score by Class</h3>
          </div>
          <div className="p-4">
            <BarChart
              data={f1Data}
              width={400}
              height={300}
              barColor="#8b5cf6"
              xAxisLabel="Class"
              yAxisLabel="F1 Score"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-base font-medium text-gray-900">Model Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Model Architecture</h4>
              <p className="mt-1 text-base font-medium">Ensemble (Random Forest + XGBoost)</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Training Time</h4>
              <p className="mt-1 text-base font-medium">3h 25m</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Features Used</h4>
              <p className="mt-1 text-base font-medium">32 features</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Data Split</h4>
              <p className="mt-1 text-base font-medium">70% train / 15% validation / 15% test</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
              <p className="mt-1 text-base font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Algorithm</h4>
              <p className="mt-1 text-base font-medium">Multi-class classification</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500">Top Features by Importance</h4>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li className="text-sm text-gray-700">Flow Duration</li>
              <li className="text-sm text-gray-700">Total Bytes</li>
              <li className="text-sm text-gray-700">Packet Inter-arrival Time (Mean)</li>
              <li className="text-sm text-gray-700">Flow Bytes per Second</li>
              <li className="text-sm text-gray-700">TCP Flags</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;