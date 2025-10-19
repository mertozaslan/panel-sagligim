import api from '@/lib/axios';

export interface DashboardStats {
  general: {
    totalUsers: number;
    totalPosts: number;
    totalBlogs: number;
    totalEvents: number;
    totalComments: number;
    totalDiseases: number;
  };
  users: {
    activeUsers: number;
    verifiedUsers: number;
    doctors: number;
    patients: number;
    admins: number;
  };
  recent: {
    newUsers: number;
    newPosts: number;
    newBlogs: number;
    newEvents: number;
    newComments: number;
  };
  topContent: {
    topLikedPosts: any[];
    topViewedPosts: any[];
    topLikedBlogs: any[];
    topViewedBlogs: any[];
    topLikedComments: any[];
    topEvents: any[];
  };
  topUsers: {
    topPosters: any[];
    topBloggers: any[];
    topCommenters: any[];
    topEventParticipants: any[];
  };
  recentUsers: any[];
  categories: {
    postCategories: any[];
    blogCategories: any[];
    eventCategories: any[];
  };
  interactions: {
    totalPostLikes: number;
    totalBlogLikes: number;
    totalCommentLikes: number;
    totalPostViews: number;
    totalBlogViews: number;
  };
  recentActivity: {
    newUsers: number;
    newPosts: number;
    newBlogs: number;
    newEvents: number;
    newComments: number;
  };
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },
};
