'use client';

import { LucideIcon } from 'lucide-react';

interface CategoryData {
  _id: string;
  count: number;
  totalViews?: number;
  totalLikes?: number;
  totalParticipants?: number;
}

interface CategoryChartProps {
  title: string;
  categories: CategoryData[];
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'orange';
  type: 'post' | 'blog' | 'event';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500',
    light: 'bg-blue-100',
    text: 'text-blue-600',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-500',
    light: 'bg-purple-100',
    text: 'text-purple-600',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-500',
    light: 'bg-orange-100',
    text: 'text-orange-600',
  },
};

export default function CategoryChart({ title, categories, icon: Icon, color, type, loading = false }: CategoryChartProps) {
  const colors = colorClasses[color];
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  const maxCount = Math.max(...categories.map(cat => cat.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${colors.text}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.light} ${colors.text}`}>
          {totalCount}
        </span>
      </div>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Henüz veri bulunmuyor
          </div>
        ) : (
          categories.map((category) => {
            const percentage = maxCount > 0 ? (category.count / maxCount) * 100 : 0;
            const secondaryInfo = type === 'post' || type === 'blog' 
              ? category.totalViews 
              : category.totalParticipants;
            
            return (
              <div key={category._id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">
                    {category._id.replace(/-/g, ' ')}
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-500">
                      {secondaryInfo} {type === 'event' ? 'katılımcı' : 'görüntülenme'}
                    </span>
                    <span className={`font-bold ${colors.text}`}>
                      {category.count}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}