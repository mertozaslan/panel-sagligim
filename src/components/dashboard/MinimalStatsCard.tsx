'use client';

import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MinimalStatsCardProps {
  title: string;
  value: number | string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink' | 'gray';
  loading?: boolean;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600',
  gray: 'from-gray-500 to-gray-600',
};

export default function MinimalStatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  loading = false,
}: MinimalStatsCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            {change && (
              <span className={`inline-flex items-center text-sm font-medium ${
                change.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {change.value}
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
