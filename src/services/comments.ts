import api from '@/lib/axios';
import { Comment, CommentCreateData, CommentUpdateData, CommentFilters, CommentResponse, CommentReportData } from '@/types';

export const commentsService = {
  // Post/Blog yorumlarını getir
  async getCommentsByPost(postId: string, filters: CommentFilters = {}): Promise<CommentResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.postType) queryParams.append('postType', filters.postType);

    const response = await api.get(`/comments/${postId}?${queryParams.toString()}`);
    return response.data;
  },

  // Yorum oluştur
  async createComment(postId: string, commentData: CommentCreateData): Promise<Comment> {
    const response = await api.post(`/comments/${postId}`, commentData);
    return response.data.comment;
  },

  // Yorum güncelle
  async updateComment(commentId: string, commentData: CommentUpdateData): Promise<Comment> {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data.comment;
  },

  // Yorum sil
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },

  // Yorum beğen/beğenme
  async toggleLike(commentId: string): Promise<{ likes: number; dislikes: number }> {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },

  // Yorum beğenme/beğenmeme
  async toggleDislike(commentId: string): Promise<{ likes: number; dislikes: number }> {
    const response = await api.post(`/comments/${commentId}/dislike`);
    return response.data;
  },

  // Yorum raporla
  async reportComment(commentId: string, reportData: CommentReportData): Promise<void> {
    await api.post(`/comments/${commentId}/report`, reportData);
  }
};
