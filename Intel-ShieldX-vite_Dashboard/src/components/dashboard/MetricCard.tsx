import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  colorClass = 'bg-blue-500',
}) => {
  return (
    <div className="relative rounded-lg bg-white p-5 shadow transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass} text-white`}>
          {icon}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-gradient-to-r from-blue-400 to-blue-600"></div>
    </div>
  );
};

export default MetricCard;