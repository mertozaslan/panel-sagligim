'use client';

import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: string;
    type: 'up' | 'down';
  };
}

interface StatSection {
  title: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  icon: LucideIcon;
  stats: StatItem[];
}

interface StatsOverviewProps {
  sections: StatSection[];
  loading?: boolean;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    iconBg: 'bg-red-100',
  },
};

export default function StatsOverview({ sections, loading = false }: StatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map((section, sectionIdx) => {
        const colors = colorClasses[section.color];
        const SectionIcon = section.icon;
        
        return (
          <div
            key={sectionIdx}
            className={`bg-white rounded-xl border ${colors.border} hover:shadow-md transition-all duration-200 overflow-hidden`}
          >
            {/* Header */}
            <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                  <SectionIcon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <h3 className={`font-semibold ${colors.text}`}>{section.title}</h3>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4">
              {section.stats.length === 5 ? (
                <div className="space-y-3">
                  {/* Üst sıra - 3 metrik */}
                  <div className="grid grid-cols-3 gap-2">
                    {section.stats.slice(0, 3).map((stat, statIdx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={statIdx} className="relative group">
                          <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 h-full">
                            <div className="flex items-center justify-between mb-1">
                              <StatIcon className={`h-4 w-4 ${colors.text}`} />
                              {stat.trend && (
                                <span className={`text-xs font-medium ${
                                  stat.trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {stat.trend.type === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="text-xl font-bold text-gray-900 mb-0.5">
                              {stat.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Alt sıra - 2 metrik (tam genişlik) */}
                  <div className="grid grid-cols-2 gap-2">
                    {section.stats.slice(3, 5).map((stat, statIdx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={statIdx + 3} className="relative group">
                          <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 h-full">
                            <div className="flex items-center justify-between mb-1">
                              <StatIcon className={`h-4 w-4 ${colors.text}`} />
                              {stat.trend && (
                                <span className={`text-xs font-medium ${
                                  stat.trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {stat.trend.type === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="text-xl font-bold text-gray-900 mb-0.5">
                              {stat.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {section.stats.map((stat, statIdx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div
                        key={statIdx}
                        className="relative group"
                      >
                        <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 h-full">
                          <div className="flex items-center justify-between mb-1">
                            <StatIcon className={`h-4 w-4 ${colors.text}`} />
                            {stat.trend && (
                              <span className={`text-xs font-medium ${
                                stat.trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {stat.trend.type === 'up' ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-0.5">
                            {stat.value.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

