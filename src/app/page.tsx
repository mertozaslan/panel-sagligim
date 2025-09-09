'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import {
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { DashboardStats, ActivityLog } from '@/types';

// Mock data - in a real app, this would come from an API
const mockStats: DashboardStats = {
  totalUsers: 2847,
  totalExperts: 156,
  newUsersThisWeek: 89,
  postsThisMonth: 234,
  questionsThisMonth: 167,
  answersThisMonth: 445,
  pendingExpertApplications: 5,
  pendingContentModeration: 12,
  unansweredQuestions: 8,
  reportedContent: 3,
  activeEvents: 7
};

const mockActivities: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    user: { id: '1', name: 'Dr. Mehmet Yılmaz', email: '', role: 'expert', status: 'active', createdAt: new Date() },
    action: 'question_answered',
    description: 'beslenme ile ilgili bir soruyu yanıtladı',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    userId: '2',
    user: { id: '2', name: 'Ayşe Kaya', email: '', role: 'user', status: 'active', createdAt: new Date() },
    action: 'post_published',
    description: 'yeni bir makale paylaştı',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    userId: '3',
    user: { id: '3', name: 'Dr. Fatma Öz', email: '', role: 'expert', status: 'pending', createdAt: new Date() },
    action: 'expert_applied',
    description: 'uzman olmak için başvuruda bulundu',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '4',
    userId: '4',
    user: { id: '4', name: 'Can Demir', email: '', role: 'user', status: 'active', createdAt: new Date() },
    action: 'user_registered',
    description: 'platforma yeni katıldı',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: '5',
    userId: '5',
    user: { id: '5', name: 'Admin', email: '', role: 'admin', status: 'active', createdAt: new Date() },
    action: 'event_created',
    description: 'yeni bir etkinlik oluşturdu',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  }
];

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Sağlık platformunuzun genel durumu ve önemli metrikleri"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bu Hafta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Yeni Kullanıcı Kayıtları"
              value={mockStats.newUsersThisWeek}
              change={{ value: '+12%', trend: 'up' }}
              icon={Users}
              color="health"
            />
            <StatsCard
              title="Paylaşılan Makaleler"
              value={mockStats.postsThisMonth}
              change={{ value: '+8%', trend: 'up' }}
              icon={FileText}
              color="primary"
            />
            <StatsCard
              title="Sorulan Sorular"
              value={mockStats.questionsThisMonth}
              change={{ value: '+15%', trend: 'up' }}
              icon={MessageSquare}
              color="warning"
            />
            <StatsCard
              title="Verilen Cevaplar"
              value={mockStats.answersThisMonth}
              change={{ value: '+22%', trend: 'up' }}
              icon={UserCheck}
              color="health"
            />
          </div>
        </div>

        {/* Attention Required */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <AlertTriangle className="inline h-5 w-5 mr-2 text-yellow-500" />
            Dikkat Gereken
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Onay Bekleyen Uzmanlar"
              value={mockStats.pendingExpertApplications}
              icon={UserCheck}
              color="warning"
            />
            <StatsCard
              title="Moderasyon Bekleyen Paylaşımlar"
              value={mockStats.pendingContentModeration}
              icon={FileText}
              color="warning"
            />
            <StatsCard
              title="Cevaplanmamış Sorular (48 saat+)"
              value={mockStats.unansweredQuestions}
              icon={MessageSquare}
              color="danger"
            />
            <StatsCard
              title="Rapor Edilen İçerikler"
              value={mockStats.reportedContent}
              icon={AlertTriangle}
              color="danger"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
