import React from 'react';
import { Info } from 'lucide-react';

interface ModelCardProps {
  name: string;
  metric: string;
  value: number;
  description: string;
  isPercentage?: boolean;
  isHigherBetter?: boolean;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
}

const ModelCard: React.FC<ModelCardProps> = ({
  name,
  metric,
  value,
  description,
  isPercentage = true,
  isHigherBetter = true,
  thresholds = { low: 0.6, medium: 0.8, high: 0.9 },
}) => {
  const getColor = () => {
    if (isHigherBetter) {
      if (value >= thresholds.high) return 'text-green-600';
      if (value >= thresholds.medium) return 'text-blue-600';
      if (value >= thresholds.low) return 'text-orange-500';
      return 'text-red-600';
    } else {
      if (value <= thresholds.low) return 'text-green-600';
      if (value <= thresholds.medium) return 'text-blue-600';
      if (value <= thresholds.high) return 'text-orange-500';
      return 'text-red-600';
    }
  };

  const getIndicator = () => {
    if (isHigherBetter) {
      if (value >= thresholds.high) return '↑';
      if (value >= thresholds.medium) return '↗';
      if (value >= thresholds.low) return '→';
      return '↓';
    } else {
      if (value <= thresholds.low) return '↓';
      if (value <= thresholds.medium) return '→';
      if (value <= thresholds.high) return '↗';
      return '↑';
    }
  };

  const formattedValue = isPercentage ? `${(value * 100).toFixed(1)}%` : value.toFixed(2);
  
  return (
    <div className="rounded-lg bg-white p-5 shadow transition-all duration-300 hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{name}</h3>
        <div className="group relative">
          <Info className="h-4 w-4 cursor-help text-gray-400" />
          <div className="invisible absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded bg-gray-800 p-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
            {description}
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">{metric}</p>
          <p className={`mt-1 text-3xl font-bold ${getColor()}`}>{formattedValue}</p>
        </div>
        <div className={`text-2xl ${getColor()}`}>
          {getIndicator()}
        </div>
      </div>
      
      <div className="mt-4 h-2 rounded-full bg-gray-200">
        <div 
          className={`h-2 rounded-full ${
            isHigherBetter ? 'bg-blue-600' : 'bg-red-600'
          }`}
          style={{ width: `${isHigherBetter ? value * 100 : (1 - value) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ModelCard;