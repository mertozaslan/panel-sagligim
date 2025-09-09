import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  color?: 'primary' | 'health' | 'warning' | 'danger';
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary' 
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    health: 'bg-health-50 text-health-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={clsx('flex items-center mt-2 text-sm', trendClasses[change.trend])}>
              <span>{change.value}</span>
              <span className="ml-1">bu hafta</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
