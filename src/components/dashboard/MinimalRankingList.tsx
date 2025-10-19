'use client';

import { LucideIcon } from 'lucide-react';

interface RankingItem {
  id: string;
  name: string;
  subtitle?: string;
  value: number;
  label: string;
  badge?: string;
}

interface MinimalRankingListProps {
  title: string;
  items: RankingItem[];
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
  loading?: boolean;
}

const colorClasses = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  purple: 'text-purple-600 bg-purple-50',
  orange: 'text-orange-600 bg-orange-50',
  red: 'text-red-600 bg-red-50',
  pink: 'text-pink-600 bg-pink-50',
};

export default function MinimalRankingList({ title, items, icon: Icon, color, loading = false }: MinimalRankingListProps) {
  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className={`h-5 w-5 ${colors.split(' ')[0]}`} />
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-400">({items.length})</span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Henüz veri bulunmuyor
          </div>
        ) : (
          items.slice(0, 5).map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.badge && (
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        item.badge === 'Doktor' ? 'bg-blue-50 text-blue-700' :
                        item.badge === 'Admin' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right ml-3">
                <div className="text-sm font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
