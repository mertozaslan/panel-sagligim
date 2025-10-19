import { create } from 'zustand';
import { blogsService } from '@/services/blogs';
import { Blog, BlogCreateData, BlogUpdateData, BlogFilters, BlogReportData } from '@/types';

interface BlogsState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: BlogFilters;
}

interface BlogsActions {
  // Blog listesi işlemleri
  fetchBlogs: (filters?: BlogFilters) => Promise<void>;
  fetchBlogById: (blogId: string) => Promise<void>;
  fetchUserBlogs: (userId: string, filters?: BlogFilters) => Promise<void>;
  
  // CRUD işlemleri
  createBlog: (blogData: BlogCreateData) => Promise<Blog>;
  updateBlog: (blogId: string, blogData: BlogUpdateData) => Promise<Blog>;
  deleteBlog: (blogId: string) => Promise<void>;
  
  // Etkileşim işlemleri
  toggleLike: (blogId: string) => Promise<void>;
  toggleDislike: (blogId: string) => Promise<void>;
  reportBlog: (blogId: string, reportData: BlogReportData) => Promise<void>;
  
  // Admin işlemleri
  approveBlog: (blogId: string) => Promise<void>;
  rejectBlog: (blogId: string, reason?: string) => Promise<void>;
  unpublishBlog: (blogId: string) => Promise<void>;
  
  // State yönetimi
  setFilters: (filters: BlogFilters) => void;
  clearError: () => void;
  reset: () => void;
}

type BlogsStore = BlogsState & BlogsActions;

const initialState: BlogsState = {
  blogs: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    page: 1,
    limit: 10,
  },
};

export const useBlogsStore = create<BlogsStore>((set, get) => ({
  ...initialState,

  // Blog listesi işlemleri
  fetchBlogs: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await blogsService.getAllBlogs(currentFilters);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedBlogs = response.blogs.map(blog => ({
        ...blog,
        id: (blog as any)._id || blog.id, // API'den gelen _id'yi id olarak kullan
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        // Virtual field'ları hesapla
        likesCount: blog.likes?.length || 0,
        dislikesCount: blog.dislikes?.length || 0,
      }));

      set({
        blogs: processedBlogs,
        pagination: response.pagination,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Blog\'lar yüklenirken bir hata oluştu',
      });
    }
  },

  fetchBlogById: async (blogId: string) => {
    set({ loading: true, error: null });
    try {
      const blog = await blogsService.getBlogById(blogId);
      
      // Tarih verilerini düzgün şekilde işle
      const processedBlog = {
        ...blog,
        id: (blog as any)._id || blog.id,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        likesCount: blog.likes?.length || 0,
        dislikesCount: blog.dislikes?.length || 0,
      };

      set(state => ({
        blogs: state.blogs.map(b => b.id === blogId ? processedBlog : b),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Blog yüklenirken bir hata oluştu',
      });
    }
  },

  fetchUserBlogs: async (userId: string, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await blogsService.getUserBlogs(userId, currentFilters);
      
      // Tarih verilerini düzgün şekilde işle ve virtual field'ları hesapla
      const processedBlogs = response.blogs.map(blog => ({
        ...blog,
        id: (blog as any)._id || blog.id,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        likesCount: blog.likes?.length || 0,
        dislikesCount: blog.dislikes?.length || 0,
      }));

      set({
        blogs: processedBlogs,
        pagination: response.pagination,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Kullanıcı blog\'ları yüklenirken bir hata oluştu',
      });
    }
  },

  // CRUD işlemleri
  createBlog: async (blogData: BlogCreateData) => {
    set({ loading: true, error: null });
    try {
      const blog = await blogsService.createBlog(blogData);
      
      // Tarih verilerini düzgün şekilde işle
      const processedBlog = {
        ...blog,
        id: (blog as any)._id || blog.id,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        likesCount: blog.likes?.length || 0,
        dislikesCount: blog.dislikes?.length || 0,
      };

      set(state => ({
        blogs: [processedBlog, ...state.blogs],
        loading: false,
        error: null,
      }));

      return processedBlog;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Blog oluşturulurken bir hata oluştu',
      });
      throw error;
    }
  },

  updateBlog: async (blogId: string, blogData: BlogUpdateData) => {
    set({ loading: true, error: null });
    try {
      const blog = await blogsService.updateBlog(blogId, blogData);
      
      // Tarih verilerini düzgün şekilde işle
      const processedBlog = {
        ...blog,
        id: (blog as any)._id || blog.id,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        likesCount: blog.likes?.length || 0,
        dislikesCount: blog.dislikes?.length || 0,
      };

      set(state => ({
        blogs: state.blogs.map(b => b.id === blogId ? processedBlog : b),
        loading: false,
        error: null,
      }));

      return processedBlog;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Blog güncellenirken bir hata oluştu',
      });
      throw error;
    }
  },

  deleteBlog: async (blogId: string) => {
    set({ loading: true, error: null });
    try {
      await blogsService.deleteBlog(blogId);
      
      set(state => ({
        blogs: state.blogs.filter(b => b.id !== blogId),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Blog silinirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Etkileşim işlemleri
  toggleLike: async (blogId: string) => {
    try {
      const response = await blogsService.toggleLike(blogId);
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, likesCount: response.likes, dislikesCount: response.dislikes }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Beğeni işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  toggleDislike: async (blogId: string) => {
    try {
      const response = await blogsService.toggleDislike(blogId);
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, likesCount: response.likes, dislikesCount: response.dislikes }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Beğenmeme işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  reportBlog: async (blogId: string, reportData: BlogReportData) => {
    try {
      await blogsService.reportBlog(blogId, reportData);
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, isReported: true, reportCount: blog.reportCount + 1 }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Raporlama işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  // Admin işlemleri
  approveBlog: async (blogId: string) => {
    try {
      await blogsService.updateBlog(blogId, { isPublished: true });
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, isPublished: true, isApproved: true }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Blog onaylanırken bir hata oluştu',
      });
      throw error;
    }
  },

  rejectBlog: async (blogId: string, reason?: string) => {
    try {
      await blogsService.updateBlog(blogId, { isPublished: false });
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, isPublished: false, isApproved: false }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Blog reddedilirken bir hata oluştu',
      });
      throw error;
    }
  },

  unpublishBlog: async (blogId: string) => {
    try {
      await blogsService.updateBlog(blogId, { isPublished: false });
      
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, isPublished: false }
            : blog
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Blog yayından kaldırılırken bir hata oluştu',
      });
      throw error;
    }
  },

  // State yönetimi
  setFilters: (filters: BlogFilters) => {
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
