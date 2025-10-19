import api from '@/lib/axios';
import { Blog, BlogCreateData, BlogUpdateData, BlogFilters, BlogResponse, BlogReportData } from '@/types';

export const blogsService = {
  // Tüm blog'ları getir
  async getAllBlogs(filters: BlogFilters = {}): Promise<BlogResponse> {
    const queryParams = new URLSearchParams();
    
    // Admin paneli için isAdmin=true ekle
    queryParams.append('isAdmin', 'true');
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.author) queryParams.append('author', filters.author);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());
    if (filters.published !== undefined) queryParams.append('published', filters.published.toString());

    const response = await api.get(`/blogs?${queryParams.toString()}`);
    return response.data;
  },

  // Blog detayını getir
  async getBlogById(blogId: string): Promise<Blog> {
    const response = await api.get(`/blogs/${blogId}`);
    return response.data.blog;
  },

  // Blog detayını slug ile getir
  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data.blog;
  },

  // Blog oluştur
  async createBlog(blogData: BlogCreateData): Promise<Blog> {
    const response = await api.post('/blogs', blogData);
    return response.data.blog;
  },

  // Blog güncelle
  async updateBlog(blogId: string, blogData: BlogUpdateData): Promise<Blog> {
    const response = await api.put(`/blogs/${blogId}`, blogData);
    return response.data.blog;
  },

  // Blog sil
  async deleteBlog(blogId: string): Promise<void> {
    await api.delete(`/blogs/${blogId}`);
  },

  // Blog beğen/beğenme
  async toggleLike(blogId: string): Promise<{ likes: number; dislikes: number }> {
    const response = await api.post(`/blogs/${blogId}/like`);
    return response.data;
  },

  // Blog beğenme/beğenmeme
  async toggleDislike(blogId: string): Promise<{ likes: number; dislikes: number }> {
    const response = await api.post(`/blogs/${blogId}/dislike`);
    return response.data;
  },

  // Blog raporla
  async reportBlog(blogId: string, reportData: BlogReportData): Promise<void> {
    await api.post(`/blogs/${blogId}/report`, reportData);
  },

  // Kullanıcının blog'larını getir
  async getUserBlogs(userId: string, filters: BlogFilters = {}): Promise<BlogResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const response = await api.get(`/blogs/user/${userId}?${queryParams.toString()}`);
    return response.data;
  },

  // Öne çıkan blog'ları getir
  async getFeaturedBlogs(limit: number = 5): Promise<Blog[]> {
    const response = await api.get(`/blogs/featured?limit=${limit}`);
    return response.data.blogs;
  },

  // Blog kategorilerini getir
  async getBlogCategories(): Promise<{ name: string; count: number }[]> {
    const response = await api.get('/blogs/categories');
    return response.data.categories;
  }
};
