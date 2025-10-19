import { create } from 'zustand';
import { commentsService } from '@/services/comments';
import { Comment, CommentCreateData, CommentUpdateData, CommentFilters, CommentReportData } from '@/types';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: CommentFilters;
}

interface CommentsActions {
  // Comment listesi işlemleri
  fetchCommentsByPost: (postId: string, filters?: CommentFilters) => Promise<void>;
  
  // CRUD işlemleri
  createComment: (postId: string, commentData: CommentCreateData) => Promise<Comment>;
  updateComment: (commentId: string, commentData: CommentUpdateData) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
  
  // Etkileşim işlemleri
  toggleLike: (commentId: string) => Promise<void>;
  toggleDislike: (commentId: string) => Promise<void>;
  reportComment: (commentId: string, reportData: CommentReportData) => Promise<void>;
  
  // State yönetimi
  setFilters: (filters: CommentFilters) => void;
  clearError: () => void;
  reset: () => void;
}

type CommentsStore = CommentsState & CommentsActions;

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    page: 1,
    limit: 10,
    postType: 'Post',
  },
};

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  ...initialState,

  // Comment listesi işlemleri
  fetchCommentsByPost: async (postId: string, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await commentsService.getCommentsByPost(postId, currentFilters);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedComments = response.comments.map(comment => ({
        ...comment,
        id: (comment as any)._id || comment.id, // API'den gelen _id'yi id olarak kullan
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
        // Virtual field'ları hesapla
        likeCount: comment.likes?.length || 0,
        dislikeCount: comment.dislikes?.length || 0,
        replyCount: comment.replies?.length || 0,
      }));

      set({
        comments: processedComments,
        pagination: response.pagination,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Yorumlar yüklenirken bir hata oluştu',
      });
    }
  },

  // CRUD işlemleri
  createComment: async (postId: string, commentData: CommentCreateData) => {
    set({ loading: true, error: null });
    try {
      const comment = await commentsService.createComment(postId, commentData);
      
      // Tarih verilerini düzgün şekilde işle
      const processedComment = {
        ...comment,
        id: (comment as any)._id || comment.id,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
        likeCount: comment.likes?.length || 0,
        dislikeCount: comment.dislikes?.length || 0,
        replyCount: comment.replies?.length || 0,
      };

      set(state => ({
        comments: [processedComment, ...state.comments],
        loading: false,
        error: null,
      }));

      return processedComment;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Yorum oluşturulurken bir hata oluştu',
      });
      throw error;
    }
  },

  updateComment: async (commentId: string, commentData: CommentUpdateData) => {
    set({ loading: true, error: null });
    try {
      const comment = await commentsService.updateComment(commentId, commentData);
      
      // Tarih verilerini düzgün şekilde işle
      const processedComment = {
        ...comment,
        id: (comment as any)._id || comment.id,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
        likeCount: comment.likes?.length || 0,
        dislikeCount: comment.dislikes?.length || 0,
        replyCount: comment.replies?.length || 0,
      };

      set(state => ({
        comments: state.comments.map(c => c.id === commentId ? processedComment : c),
        loading: false,
        error: null,
      }));

      return processedComment;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Yorum güncellenirken bir hata oluştu',
      });
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    set({ loading: true, error: null });
    try {
      await commentsService.deleteComment(commentId);
      
      set(state => ({
        comments: state.comments.filter(c => c.id !== commentId),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Yorum silinirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Etkileşim işlemleri
  toggleLike: async (commentId: string) => {
    try {
      const response = await commentsService.toggleLike(commentId);
      
      set(state => ({
        comments: state.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likeCount: response.likes, dislikeCount: response.dislikes }
            : comment
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Beğeni işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  toggleDislike: async (commentId: string) => {
    try {
      const response = await commentsService.toggleDislike(commentId);
      
      set(state => ({
        comments: state.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likeCount: response.likes, dislikeCount: response.dislikes }
            : comment
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Beğenmeme işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  reportComment: async (commentId: string, reportData: CommentReportData) => {
    try {
      await commentsService.reportComment(commentId, reportData);
      
      set(state => ({
        comments: state.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, isReported: true, reportCount: comment.reportCount + 1 }
            : comment
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Raporlama işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  // State yönetimi
  setFilters: (filters: CommentFilters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
