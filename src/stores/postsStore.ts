import { create } from 'zustand';
import { Post, PostFilters, PostCreateData, PostUpdateData, PostReportData } from '@/types';
import { postsService } from '@/services/posts';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: PostFilters;
}

interface PostsActions {
  // Posts listesi işlemleri
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  fetchPostById: (postId: string) => Promise<void>;
  fetchUserPosts: (userId: string, filters?: PostFilters) => Promise<void>;
  
  // CRUD işlemleri
  createPost: (postData: PostCreateData) => Promise<Post>;
  updatePost: (postId: string, postData: PostUpdateData) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  
  // Etkileşim işlemleri
  toggleLike: (postId: string) => Promise<void>;
  toggleDislike: (postId: string) => Promise<void>;
  reportPost: (postId: string, reportData: PostReportData) => Promise<void>;
  
  // Admin işlemleri
  approvePost: (postId: string) => Promise<void>;
  rejectPost: (postId: string, reason?: string) => Promise<void>;
  unpublishPost: (postId: string) => Promise<void>;
  
  // State yönetimi
  setFilters: (filters: PostFilters) => void;
  clearError: () => void;
  reset: () => void;
}

type PostsStore = PostsState & PostsActions;

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const usePostsStore = create<PostsStore>((set, get) => ({
  ...initialState,

  // Posts listesi işlemleri
  fetchPosts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await postsService.getAllPosts(currentFilters);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPosts = response.posts.map(post => ({
        ...post,
        id: (post as any)._id || post.id, // API'den gelen _id'yi id olarak kullan
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      }));
      
      set({
        posts: processedPosts,
        pagination: response.pagination,
        filters: currentFilters,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Post\'lar yüklenirken hata oluştu',
        loading: false,
      });
    }
  },

  fetchPostById: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const post = await postsService.getPostById(postId);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set({ currentPost: processedPost, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Post detayı yüklenirken hata oluştu',
        loading: false,
      });
    }
  },

  fetchUserPosts: async (userId: string, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await postsService.getUserPosts(userId, currentFilters);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPosts = response.posts.map(post => ({
        ...post,
        id: (post as any)._id || post.id, // API'den gelen _id'yi id olarak kullan
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      }));
      
      set({
        posts: processedPosts,
        pagination: response.pagination,
        filters: currentFilters,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Kullanıcı post\'ları yüklenirken hata oluştu',
        loading: false,
      });
    }
  },

  // CRUD işlemleri
  createPost: async (postData: PostCreateData) => {
    set({ loading: true, error: null });
    try {
      const newPost = await postsService.createPost(postData);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...newPost,
        createdAt: new Date(newPost.createdAt),
        updatedAt: new Date(newPost.updatedAt),
        publishedAt: newPost.publishedAt ? new Date(newPost.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: newPost.likes?.length || 0,
        dislikesCount: newPost.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set((state) => ({
        posts: [processedPost, ...state.posts],
        loading: false,
      }));
      return processedPost;
    } catch (error: any) {
      set({
        error: error.message || 'Post oluşturulurken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  updatePost: async (postId: string, postData: PostUpdateData) => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await postsService.updatePost(postId, postData);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...updatedPost,
        createdAt: new Date(updatedPost.createdAt),
        updatedAt: new Date(updatedPost.updatedAt),
        publishedAt: updatedPost.publishedAt ? new Date(updatedPost.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: updatedPost.likes?.length || 0,
        dislikesCount: updatedPost.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? processedPost : post
        ),
        currentPost: state.currentPost?.id === postId ? processedPost : state.currentPost,
        loading: false,
      }));
      return processedPost;
    } catch (error: any) {
      set({
        error: error.message || 'Post güncellenirken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  deletePost: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      await postsService.deletePost(postId);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
        currentPost: state.currentPost?.id === postId ? null : state.currentPost,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Post silinirken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  // Etkileşim işlemleri
  toggleLike: async (postId: string) => {
    try {
      const result = await postsService.toggleLike(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, likesCount: result.likesCount }
            : post
        ),
        currentPost: state.currentPost?.id === postId
          ? { ...state.currentPost, likesCount: result.likesCount }
          : state.currentPost,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Beğeni işlemi sırasında hata oluştu' });
      throw error;
    }
  },

  toggleDislike: async (postId: string) => {
    try {
      const result = await postsService.toggleDislike(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, dislikesCount: result.dislikesCount }
            : post
        ),
        currentPost: state.currentPost?.id === postId
          ? { ...state.currentPost, dislikesCount: result.dislikesCount }
          : state.currentPost,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Beğenmeme işlemi sırasında hata oluştu' });
      throw error;
    }
  },

  reportPost: async (postId: string, reportData: PostReportData) => {
    set({ loading: true, error: null });
    try {
      await postsService.reportPost(postId, reportData);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isReported: true, reportCount: post.reportCount + 1 }
            : post
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Post raporlanırken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  // Admin işlemleri
  approvePost: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const approvedPost = await postsService.approvePost(postId);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...approvedPost,
        createdAt: new Date(approvedPost.createdAt),
        updatedAt: new Date(approvedPost.updatedAt),
        publishedAt: approvedPost.publishedAt ? new Date(approvedPost.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: approvedPost.likes?.length || 0,
        dislikesCount: approvedPost.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? processedPost : post
        ),
        currentPost: state.currentPost?.id === postId ? processedPost : state.currentPost,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Post onaylanırken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  rejectPost: async (postId: string, reason?: string) => {
    set({ loading: true, error: null });
    try {
      const rejectedPost = await postsService.rejectPost(postId, reason);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...rejectedPost,
        createdAt: new Date(rejectedPost.createdAt),
        updatedAt: new Date(rejectedPost.updatedAt),
        publishedAt: rejectedPost.publishedAt ? new Date(rejectedPost.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: rejectedPost.likes?.length || 0,
        dislikesCount: rejectedPost.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? processedPost : post
        ),
        currentPost: state.currentPost?.id === postId ? processedPost : state.currentPost,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Post reddedilirken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  unpublishPost: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const unpublishedPost = await postsService.unpublishPost(postId);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedPost = {
        ...unpublishedPost,
        createdAt: new Date(unpublishedPost.createdAt),
        updatedAt: new Date(unpublishedPost.updatedAt),
        publishedAt: unpublishedPost.publishedAt ? new Date(unpublishedPost.publishedAt) : undefined,
        // Virtual field'ları hesapla
        likesCount: unpublishedPost.likes?.length || 0,
        dislikesCount: unpublishedPost.dislikes?.length || 0,
        commentCount: 0, // API'de commentCount yok, şimdilik 0
      };
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? processedPost : post
        ),
        currentPost: state.currentPost?.id === postId ? processedPost : state.currentPost,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Post yayından kaldırılırken hata oluştu',
        loading: false,
      });
      throw error;
    }
  },

  // State yönetimi
  setFilters: (filters: PostFilters) => {
    set((state) => ({
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
