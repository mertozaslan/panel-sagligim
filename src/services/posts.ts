import api from '@/lib/axios';
import { Post, PostCreateData, PostUpdateData, PostFilters, PostResponse, PostReportData } from '@/types';

export const postsService = {
  // Tüm post'ları getir
  async getAllPosts(filters: PostFilters = {}): Promise<PostResponse> {
    const queryParams = new URLSearchParams();
    
    // Admin paneli için isAdmin=true ekle
    queryParams.append('isAdmin', 'true');
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await api.get(`/posts?${queryParams.toString()}`);
    return response.data;
  },

  // Post detayını getir
  async getPostById(postId: string): Promise<Post> {
    const response = await api.get(`/posts/${postId}`);
    return response.data.post;
  },

  // Post oluştur
  async createPost(postData: PostCreateData): Promise<Post> {
    const response = await api.post('/posts', postData);
    return response.data.post;
  },

  // Post güncelle
  async updatePost(postId: string, postData: PostUpdateData): Promise<Post> {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data.post;
  },

  // Post sil
  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  // Post beğen/beğenme
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Post beğenme/beğenmeme
  async toggleDislike(postId: string): Promise<{ isDisliked: boolean; dislikesCount: number }> {
    const response = await api.post(`/posts/${postId}/dislike`);
    return response.data;
  },

  // Post raporla
  async reportPost(postId: string, reportData: PostReportData): Promise<void> {
    await api.post(`/posts/${postId}/report`, reportData);
  },

  // Kullanıcının post'larını getir
  async getUserPosts(userId: string, filters: PostFilters = {}): Promise<PostResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);

    const response = await api.get(`/posts/user/${userId}?${queryParams.toString()}`);
    return response.data;
  },

  // Post onayla (admin)
  async approvePost(postId: string): Promise<Post> {
    const response = await api.post(`/posts/${postId}/approve`);
    return response.data.post;
  },

  // Post reddet (admin)
  async rejectPost(postId: string, reason?: string): Promise<Post> {
    const response = await api.post(`/posts/${postId}/reject`, { reason });
    return response.data.post;
  },

  // Post'u yayından kaldır (admin)
  async unpublishPost(postId: string): Promise<Post> {
    const response = await api.post(`/posts/${postId}/unpublish`);
    return response.data.post;
  }
};
