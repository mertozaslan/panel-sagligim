'use client';

import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import MinimalRankingList from '@/components/dashboard/MinimalRankingList';
import CategoryChart from '@/components/dashboard/CategoryChart';
import RecentUsersList from '@/components/dashboard/RecentUsersList';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Activity,
  RefreshCw,
  BookOpen,
  PenTool,
  Heart,
  Eye,
  TrendingUp,
  Database,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  const { stats, loading, error, fetchDashboardStats, clearError } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (error) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Sağlık platformunuzun genel durumu">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchDashboardStats();
            }}
            className="px-6 py-2 bg-health-500 text-white rounded-lg hover:bg-health-600"
          >
            Tekrar Dene
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Sağlık platformunuzun genel durumu"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
          </div>
          <button
            onClick={() => fetchDashboardStats()}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>

        {/* Gruplu İstatistikler */}
        <StatsOverview
          loading={loading}
          sections={[
            {
              title: 'Platform Genel',
              color: 'blue',
              icon: Database,
              stats: [
                { label: 'Kullanıcı', value: stats?.general?.totalUsers || 0, icon: Users },
                { label: 'Post', value: stats?.general?.totalPosts || 0, icon: FileText },
                { label: 'Blog', value: stats?.general?.totalBlogs || 0, icon: BookOpen },
                { label: 'Etkinlik', value: stats?.general?.totalEvents || 0, icon: Calendar },
                { label: 'Yorum', value: stats?.general?.totalComments || 0, icon: MessageSquare },
              ],
            },
            {
              title: 'Kullanıcı Detay',
              color: 'green',
              icon: Users,
              stats: [
                { label: 'Toplam', value: stats?.users?.activeUsers || 0, icon: Activity },
                { label: 'Doktor', value: stats?.users?.doctors || 0, icon: Shield },
                { label: 'Kullanıcı', value: stats?.users?.patients || 0, icon: Users },
                { label: 'Admin', value: stats?.users?.admins || 0, icon: Shield },
                { label: 'Yeni (24s)', value: stats?.recentActivity?.newUsers || 0, icon: TrendingUp, trend: { value: '+', type: 'up' } },
              ],
            },
            {
              title: 'İçerik & Etkileşim',
              color: 'purple',
              icon: Activity,
              stats: [
                { label: 'Post Beğeni', value: stats?.interactions?.totalPostLikes || 0, icon: Heart },
                { label: 'Blog Beğeni', value: stats?.interactions?.totalBlogLikes || 0, icon: Heart },
                { label: 'Yorum Beğeni', value: stats?.interactions?.totalCommentLikes || 0, icon: Heart },
                { label: 'Post Görünt.', value: stats?.interactions?.totalPostViews || 0, icon: Eye },
                { label: 'Blog Görünt.', value: stats?.interactions?.totalBlogViews || 0, icon: Eye },
                { label: 'Yeni Post (24s)', value: stats?.recentActivity?.newPosts || 0, icon: TrendingUp, trend: { value: '+', type: 'up' } },
              ],
            },
          ]}
        />

        {/* Kategori Dağılımları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CategoryChart
            title="Post Kategorileri"
            categories={stats?.categories?.postCategories || []}
            icon={FileText}
            color="blue"
            type="post"
            loading={loading}
          />
          <CategoryChart
            title="Blog Kategorileri"
            categories={stats?.categories?.blogCategories || []}
            icon={BookOpen}
            color="purple"
            type="blog"
            loading={loading}
          />
          <CategoryChart
            title="Etkinlik Kategorileri"
            categories={stats?.categories?.eventCategories || []}
            icon={Calendar}
            color="orange"
            type="event"
            loading={loading}
          />
        </div>

        {/* Kullanıcı Aktiviteleri */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecentUsersList
            users={stats?.recentUsers || []}
            loading={loading}
          />
          <MinimalRankingList
            title="En Çok Post Atanlar"
            items={(stats?.topUsers?.topPosters || []).map((user: any) => ({
              id: user.userId,
              name: `${user.firstName || 'Bilinmeyen'} ${user.lastName || 'Kullanıcı'}`,
              subtitle: `@${user.username || 'bilinmeyen'}`,
              value: user.postCount || 0,
              label: 'post',
              badge: user.role === 'doctor' ? 'Doktor' : user.role === 'admin' ? 'Admin' : undefined
            }))}
            icon={FileText}
            color="green"
            loading={loading}
          />
          <MinimalRankingList
            title="En Çok Yorum Yapanlar"
            items={(stats?.topUsers?.topCommenters || []).map((user: any) => ({
              id: user.userId,
              name: `${user.firstName || 'Bilinmeyen'} ${user.lastName || 'Kullanıcı'}`,
              subtitle: `@${user.username || 'bilinmeyen'}`,
              value: user.commentCount || 0,
              label: 'yorum',
              badge: user.role === 'doctor' ? 'Doktor' : user.role === 'admin' ? 'Admin' : undefined
            }))}
            icon={MessageSquare}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Post İstatistikleri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MinimalRankingList
            title="En Beğenilen Postlar"
            items={(stats?.topContent?.topLikedPosts || []).map((post: any) => ({
              id: post._id,
              name: post.title,
              subtitle: `${post.author?.firstName || 'Bilinmeyen'} ${post.author?.lastName || 'Kullanıcı'}`,
              value: post.likes?.length || 0,
              label: 'beğeni',
            }))}
            icon={Heart}
            color="red"
            loading={loading}
          />
          <MinimalRankingList
            title="En Çok Görüntülenen Postlar"
            items={(stats?.topContent?.topViewedPosts || []).map((post: any) => ({
              id: post._id,
              name: post.title,
              subtitle: `${post.author?.firstName || 'Bilinmeyen'} ${post.author?.lastName || 'Kullanıcı'}`,
              value: post.views || 0,
              label: 'görüntülenme',
            }))}
            icon={Eye}
            color="blue"
            loading={loading}
          />
        </div>

        {/* Blog İstatistikleri */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MinimalRankingList
            title="En Çok Blog Yazan Doktorlar"
            items={(stats?.topUsers?.topBloggers || []).map((user: any) => ({
              id: user.userId,
              name: `${user.firstName || 'Bilinmeyen'} ${user.lastName || 'Kullanıcı'}`,
              subtitle: `@${user.username || 'bilinmeyen'}`,
              value: user.blogCount || 0,
              label: 'blog',
              badge: 'Doktor'
            }))}
            icon={PenTool}
            color="purple"
            loading={loading}
          />
          <MinimalRankingList
            title="En Beğenilen Bloglar"
            items={(stats?.topContent?.topLikedBlogs || []).map((blog: any) => ({
              id: blog._id,
              name: blog.title,
              subtitle: `${blog.author?.firstName || 'Bilinmeyen'} ${blog.author?.lastName || 'Kullanıcı'}`,
              value: blog.likes?.length || 0,
              label: 'beğeni',
            }))}
            icon={Heart}
            color="pink"
            loading={loading}
          />
          <MinimalRankingList
            title="En Çok Görüntülenen Bloglar"
            items={(stats?.topContent?.topViewedBlogs || []).map((blog: any) => ({
              id: blog._id,
              name: blog.title,
              subtitle: `${blog.author?.firstName || 'Bilinmeyen'} ${blog.author?.lastName || 'Kullanıcı'}`,
              value: blog.views || 0,
              label: 'görüntülenme',
            }))}
            icon={Eye}
            color="green"
            loading={loading}
          />
        </div>

        {/* Etkinlik İstatistikleri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MinimalRankingList
            title="En Popüler Etkinlikler"
            items={(stats?.topContent?.topEvents || []).map((event: any) => ({
              id: event._id,
              name: event.title,
              subtitle: `${event.category || 'Kategori yok'} - ${event.location || 'Lokasyon belirtilmemiş'}`,
              value: event.currentParticipants || 0,
              label: 'katılımcı',
            }))}
            icon={Calendar}
            color="orange"
            loading={loading}
          />
          <MinimalRankingList
            title="En Çok Etkinliğe Katılanlar"
            items={(stats?.topUsers?.topEventParticipants || []).map((user: any) => ({
              id: user.userId,
              name: `${user.firstName || 'Bilinmeyen'} ${user.lastName || 'Kullanıcı'}`,
              subtitle: `@${user.username || 'bilinmeyen'}`,
              value: user.eventCount || 0,
              label: 'etkinlik',
              badge: user.role === 'doctor' ? 'Doktor' : user.role === 'admin' ? 'Admin' : undefined
            }))}
            icon={Users}
            color="blue"
            loading={loading}
          />
        </div>

        {/* Yorum İstatistikleri */}
        <div className="grid grid-cols-1 gap-4">
          <MinimalRankingList
            title="En Beğenilen Yorumlar"
            items={(stats?.topContent?.topLikedComments || []).map((comment: any) => ({
              id: comment._id,
              name: comment.content?.length > 100 ? comment.content.substring(0, 100) + '...' : comment.content || 'Yorum içeriği yok',
              subtitle: `${comment.author?.firstName || 'Bilinmeyen'} ${comment.author?.lastName || 'Kullanıcı'} - ${comment.postOrBlog?.title || 'Post'}`,
              value: comment.likes?.length || 0,
              label: 'beğeni',
            }))}
            icon={MessageSquare}
            color="purple"
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
