'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentModerationTable from '@/components/content/ContentModerationTable';
import CommentsTable from '@/components/content/CommentsTable';
import { Blog, BlogCategory, Comment } from '@/types';
import { useBlogsStore } from '@/stores/blogsStore';
import { useCommentsStore } from '@/stores/commentsStore';
import { Search, XCircle, Eye, Heart, MessageSquare, AlertTriangle, MessageCircle, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

// Blog kategorileri
const blogCategories: { value: BlogCategory; label: string }[] = [
  { value: 'medical-advice', label: 'Tıbbi Tavsiye' },
  { value: 'health-tips', label: 'Sağlık İpuçları' },
  { value: 'disease-information', label: 'Hastalık Bilgisi' },
  { value: 'treatment-guides', label: 'Tedavi Rehberleri' },
  { value: 'prevention', label: 'Korunma' },
  { value: 'nutrition', label: 'Beslenme' },
  { value: 'mental-health', label: 'Ruh Sağlığı' },
  { value: 'pediatrics', label: 'Çocuk Sağlığı' },
  { value: 'geriatrics', label: 'Yaşlı Sağlığı' },
  { value: 'emergency-care', label: 'Acil Bakım' },
  { value: 'research', label: 'Araştırma' },
  { value: 'other', label: 'Diğer' },
];

export default function BlogsPage() {
  const {
    blogs,
    loading,
    error,
    pagination,
    fetchBlogs,
    createBlog,
    deleteBlog,
    updateBlog,
    setFilters,
    clearError,
  } = useBlogsStore();

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchCommentsByPost,
    deleteComment,
    clearError: clearCommentsError,
  } = useCommentsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedBlogForComments, setSelectedBlogForComments] = useState<Blog | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingBlog, setCreatingBlog] = useState<Partial<Blog>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'other' as BlogCategory,
    tags: [],
    images: [],
    isPublished: false,
    isFeatured: false,
    medicalDisclaimer: '',
    references: [],
    seoTitle: '',
    seoDescription: '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Component mount olduğunda blogs'ları yükle
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filtreler değiştiğinde blogs'ları yeniden yükle
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter as BlogCategory : undefined,
      published: statusFilter !== 'all' ? statusFilter === 'published' : undefined,
    };
    
    setFilters(filters);
    fetchBlogs(filters);
  }, [searchTerm, categoryFilter, statusFilter]);

  const filteredBlogs = blogs;

  const handleDelete = async (item: any) => {
    const blog = item as Blog;
    // API'den gelen _id'yi id olarak kullan
    const blogId = blog.id || (blog as any)._id;
    
    const result = await Swal.fire({
      title: 'Blog\'u Sil',
      html: `"${blog.title}" başlıklı blog\'u silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-gray-800 font-semibold text-xl',
        htmlContainer: 'text-gray-600',
        confirmButton: 'rounded-xl px-6 py-3 font-medium',
        cancelButton: 'rounded-xl px-6 py-3 font-medium'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(blogId);
        
        // Blogs listesini yeniden fetch et
        await fetchBlogs();
        
        Swal.fire({
          title: 'Başarıyla Silindi!',
          html: 'Blog başarıyla silindi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-800 font-semibold text-xl',
            htmlContainer: 'text-gray-600'
          }
        });
      } catch (error) {
        console.error('Blog silme hatası:', error);
        
        Swal.fire({
          title: 'Hata!',
          html: 'Blog silinirken bir hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-800 font-semibold text-xl',
            htmlContainer: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-3 font-medium'
          }
        });
      }
    }
  };

  const handleView = (item: any) => {
    const blog = item as Blog;
    // API'den gelen _id'yi id olarak kullan
    const blogWithId = {
      ...blog,
      id: blog.id || (blog as any)._id
    };
    setSelectedBlog(blogWithId);
    setShowDetailModal(true);
  };

  const handleEdit = (item: any) => {
    const blog = item as Blog;
    // API'den gelen _id'yi id olarak kullan
    const blogWithId = {
      ...blog,
      id: blog.id || (blog as any)._id
    };
    setEditingBlog(blogWithId);
    setShowEditModal(true);
  };

  const handleViewComments = (item: any) => {
    const blog = item as Blog;
    // API'den gelen _id'yi id olarak kullan
    const blogWithId = {
      ...blog,
      id: blog.id || (blog as any)._id
    };
    setSelectedBlogForComments(blogWithId);
    setShowCommentsModal(true);
    // Blog'un yorumlarını yükle
    fetchCommentsByPost(blogWithId.id, { postType: 'Blog' });
  };

  // Dosya seçimi
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Dosya validasyonu
    if (file.size > 5 * 1024 * 1024) { // 5MB
      Swal.fire({
        title: 'Dosya Boyutu Hatası!',
        html: 'Dosya boyutu 5MB\'dan büyük olamaz!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: 'Desteklenmeyen Format!',
        html: 'Desteklenmeyen dosya formatı! Sadece JPG, PNG, GIF, WEBP formatları desteklenir.',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }
    
    setSelectedFile(file);
    Swal.fire({
      title: 'Resim Seçildi!',
      html: 'Resim başarıyla seçildi. Yüklemek için "Yükle" butonuna tıklayın.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-gray-800 font-semibold text-xl',
        htmlContainer: 'text-gray-600'
      }
    });
  };

  // Resim yükleme
  const handleUploadImage = async () => {
    if (!selectedFile) return;
    
    setIsUploadingImage(true);
    try {
      // Burada gerçek upload servisi kullanılacak
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Mock upload - gerçek implementasyonda uploadService kullanılacak
      const mockImageUrl = `/uploads/${Date.now()}-${selectedFile.name}`;
      
      setCreatingBlog(prev => ({
        ...prev,
        images: [...(prev.images || []), mockImageUrl]
      }));
      
      setSelectedFile(null);
      Swal.fire({
        title: 'Resim Yüklendi!',
        html: 'Resim başarıyla yüklendi!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600'
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Yükleme Hatası!',
        html: 'Resim yüklenirken bir hata oluştu!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreate = async () => {
    // Client-side validasyon
    if (!creatingBlog.title?.trim()) {
      Swal.fire({
        title: 'Başlık Gerekli!',
        html: 'Blog başlığı boş olamaz!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }
    
    if (creatingBlog.title!.length < 5) {
      Swal.fire({
        title: 'Başlık Çok Kısa!',
        html: 'Blog başlığı en az 5 karakter olmalı!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }
    
    if (!creatingBlog.content?.trim()) {
      Swal.fire({
        title: 'İçerik Gerekli!',
        html: 'Blog içeriği boş olamaz!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }
    
    if (creatingBlog.content!.length < 50) {
      Swal.fire({
        title: 'İçerik Çok Kısa!',
        html: 'Blog içeriği en az 50 karakter olmalı!',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
      return;
    }

    try {
      await createBlog({
        title: creatingBlog.title!,
        content: creatingBlog.content!,
        excerpt: creatingBlog.excerpt,
        category: creatingBlog.category!,
        tags: creatingBlog.tags || [],
        images: creatingBlog.images || [],
        isPublished: creatingBlog.isPublished || false,
        isFeatured: creatingBlog.isFeatured || false,
        medicalDisclaimer: creatingBlog.medicalDisclaimer,
        references: creatingBlog.references || [],
        seoTitle: creatingBlog.seoTitle,
        seoDescription: creatingBlog.seoDescription,
      });
      
      // Blogs listesini yeniden fetch et
      await fetchBlogs();
      
      setShowCreateModal(false);
      setCreatingBlog({
        title: '',
        content: '',
        excerpt: '',
        category: 'other' as BlogCategory,
        tags: [],
        images: [],
        isPublished: false,
        isFeatured: false,
        medicalDisclaimer: '',
        references: [],
        seoTitle: '',
        seoDescription: '',
      });
      setSelectedFile(null);
      
      Swal.fire({
        title: 'Başarıyla Oluşturuldu!',
        html: 'Blog başarıyla oluşturuldu.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600'
        }
      });
    } catch (error) {
      console.error('Blog oluşturma hatası:', error);
      
      Swal.fire({
        title: 'Hata!',
        html: 'Blog oluşturulurken bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800 font-semibold text-xl',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-3 font-medium'
        }
      });
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    const result = await Swal.fire({
      title: 'Yorumu Sil',
      html: `Bu yorumu silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-gray-800 font-semibold text-xl',
        htmlContainer: 'text-gray-600',
        confirmButton: 'rounded-xl px-6 py-3 font-medium',
        cancelButton: 'rounded-xl px-6 py-3 font-medium'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteComment(comment.id);
        
        Swal.fire({
          title: 'Başarıyla Silindi!',
          html: 'Yorum başarıyla silindi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-800 font-semibold text-xl',
            htmlContainer: 'text-gray-600'
          }
        });
      } catch (error) {
        console.error('Yorum silme hatası:', error);
        
        Swal.fire({
          title: 'Hata!',
          html: 'Yorum silinirken bir hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-800 font-semibold text-xl',
            htmlContainer: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-3 font-medium'
          }
        });
      }
    }
  };

  return (
    <DashboardLayout 
      title="Bloglar"
      subtitle="Blog içeriklerini inceleyin ve yönetin"
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                  <h3 className="text-sm font-medium text-red-800">Hata</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Blog ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {blogCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="published">Yayınlanmış</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>
            </div>

            {/* Yeni Blog Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-health-600 hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500 focus:ring-offset-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Yeni Blog
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
            <div className="text-sm text-gray-600">Toplam Blog</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{blogs.filter(blog => blog.isPublished).length}</div>
            <div className="text-sm text-gray-600">Yayınlanmış</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{blogs.filter(blog => !blog.isPublished).length}</div>
            <div className="text-sm text-gray-600">Taslak</div>
          </div>
          </div>

        {/* Blogs Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Blog'lar yükleniyor...</p>
        </div>
        ) : (
          <ContentModerationTable
            items={filteredBlogs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewComments={handleViewComments}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Blog Düzenle
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                          </div>
                        </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik
                  </label>
                  <textarea
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value as BlogCategory})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  >
                    {blogCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingBlog.tags) ? editingBlog.tags.join(', ') : editingBlog.tags || ''}
                    onChange={(e) => setEditingBlog({...editingBlog, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    placeholder="etiket1, etiket2, etiket3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                        </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Blog Özellikleri</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingBlog.isPublished}
                          onChange={(e) => setEditingBlog({...editingBlog, isPublished: e.target.checked})}
                          className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                          </div>
                            <span className="text-sm font-medium text-gray-900">Yayınlandı</span>
                        </div>
                          <p className="text-xs text-gray-500 mt-1">Blog yayında görünür</p>
                      </div>
                      </label>
                          </div>
                            </div>
                          </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await updateBlog(editingBlog.id, {
                          title: editingBlog.title,
                          content: editingBlog.content,
                          category: editingBlog.category,
                          tags: editingBlog.tags,
                          isPublished: editingBlog.isPublished,
                        });
                        
                        // Blogs listesini yeniden fetch et
                        await fetchBlogs();
                        
                        setShowEditModal(false);
                        
                        Swal.fire({
                          title: 'Başarıyla Güncellendi!',
                          html: 'Blog başarıyla güncellendi.',
                          icon: 'success',
                          timer: 2000,
                          showConfirmButton: false,
                          background: '#ffffff',
                          customClass: {
                            popup: 'rounded-2xl shadow-2xl',
                            title: 'text-gray-800 font-semibold text-xl',
                            htmlContainer: 'text-gray-600'
                          }
                        });
                      } catch (error) {
                        console.error('Blog güncelleme hatası:', error);
                        
                        Swal.fire({
                          title: 'Hata!',
                          html: 'Blog güncellenirken bir hata oluştu.',
                          icon: 'error',
                          confirmButtonText: 'Tamam',
                          background: '#ffffff',
                          customClass: {
                            popup: 'rounded-2xl shadow-2xl',
                            title: 'text-gray-800 font-semibold text-xl',
                            htmlContainer: 'text-gray-600',
                            confirmButton: 'rounded-xl px-6 py-3 font-medium'
                          }
                        });
                      }
                    }}
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-health-600 hover:bg-health-700"
                  >
                    Güncelle
                  </button>
                        </div>
                          </div>
                        </div>
                      </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-health-50 to-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-health-500 to-health-600 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                      </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Yeni Blog Oluştur
                      </h2>
                      <p className="text-sm text-gray-600">Blog yazınızı oluşturun ve yayınlayın</p>
                    </div>
                  </div>
                        <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                    <XCircle className="h-6 w-6" />
                        </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Kategori Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Kategori Seçin *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {blogCategories.map((category) => (
                      <label
                        key={category.value}
                        className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                          creatingBlog.category === category.value
                            ? 'border-health-500 bg-health-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={creatingBlog.category === category.value}
                          onChange={(e) => setCreatingBlog({...creatingBlog, category: e.target.value as BlogCategory})}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{category.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Başlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık * ({creatingBlog.title?.length || 0}/100)
                  </label>
                  <input
                    type="text"
                    value={creatingBlog.title || ''}
                    onChange={(e) => setCreatingBlog({...creatingBlog, title: e.target.value})}
                    placeholder="Blog yazınıza çekici bir başlık ver..."
                    maxLength={100}
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-all text-lg font-medium"
                  />
                </div>

                {/* Özet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özet ({creatingBlog.excerpt?.length || 0}/200)
                  </label>
                  <textarea
                    value={creatingBlog.excerpt || ''}
                    onChange={(e) => setCreatingBlog({...creatingBlog, excerpt: e.target.value})}
                    placeholder="Blog yazınızın kısa özetini yazın..."
                    rows={2}
                    maxLength={200}
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none resize-none transition-all text-base leading-relaxed"
                  />
                </div>

                {/* İçerik */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik * ({creatingBlog.content?.length || 0}/5000)
                  </label>
                  <textarea
                    value={creatingBlog.content || ''}
                    onChange={(e) => setCreatingBlog({...creatingBlog, content: e.target.value})}
                    placeholder="Blog yazınızın detaylı içeriğini yazın..."
                    rows={8}
                    maxLength={5000}
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none resize-none transition-all text-base leading-relaxed"
                  />
                </div>

                {/* Resim Yükleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resim Yükle</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      id="blog-image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="blog-image-upload"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-health-500 hover:bg-health-50 transition-all"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📷</div>
                        <div className="text-sm font-medium text-gray-700">Resim Seç</div>
                        <div className="text-xs text-gray-500">JPG, PNG, GIF, WEBP (Max 5MB)</div>
                      </div>
                    </label>
                    
                    {selectedFile && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="text-green-600">✅</div>
                          <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                        </div>
                          <button
                          onClick={handleUploadImage}
                          disabled={isUploadingImage}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {isUploadingImage ? 'Yükleniyor...' : 'Yükle'}
                          </button>
                      </div>
                    )}

                    {creatingBlog.images && creatingBlog.images.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Yüklenen Resimler:</div>
                        {creatingBlog.images.map((image, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{image}</span>
                            <button
                              onClick={() => setCreatingBlog(prev => ({
                                ...prev,
                                images: prev.images?.filter((_, i) => i !== index) || []
                              }))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                      </div>
                ))}
                      </div>
                    )}
                  </div>
          </div>

                {/* Tıbbi Uyarı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tıbbi Uyarı</label>
                  <textarea
                    value={creatingBlog.medicalDisclaimer || ''}
                    onChange={(e) => setCreatingBlog({...creatingBlog, medicalDisclaimer: e.target.value})}
                    placeholder="Bu içerik hakkında tıbbi uyarı metni yazın..."
                    rows={3}
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-yellow-50 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:outline-none resize-none transition-all text-base leading-relaxed"
                  />
            </div>

                {/* Etiketler */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(creatingBlog.tags) ? creatingBlog.tags.join(', ') : creatingBlog.tags || ''}
                    onChange={(e) => setCreatingBlog({...creatingBlog, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    placeholder="etiket1, etiket2, etiket3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
        </div>

                {/* Blog Özellikleri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={creatingBlog.isPublished || false}
                        onChange={(e) => setCreatingBlog({...creatingBlog, isPublished: e.target.checked})}
                        className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">Yayınlandı</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Blog yayında görünür</p>
                      </div>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={creatingBlog.isFeatured || false}
                        onChange={(e) => setCreatingBlog({...creatingBlog, isFeatured: e.target.checked})}
                        className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Heart className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">Öne Çıkan</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Ana sayfada öne çıkar</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!creatingBlog.title?.trim() || !creatingBlog.content?.trim()}
                    className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-health-600 hover:bg-health-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Blog Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Blog Detayları
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedBlog.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>Yazar: {selectedBlog.author.firstName} {selectedBlog.author.lastName} (@{selectedBlog.author.username})</span>
                    <span>Kategori: {blogCategories.find(c => c.value === selectedBlog.category)?.label}</span>
                    <span>Tarih: {new Date(selectedBlog.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedBlog.content}</p>
                  </div>

                  {/* Blog Resimleri */}
                  {selectedBlog.images && selectedBlog.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Blog Resimleri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedBlog.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`https://api.saglikhep.com${image}`}
                              alt={`Blog resmi ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <button
                                onClick={() => window.open(`https://api.saglikhep.com${image}`, '_blank')}
                                className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                              >
                                <Eye className="h-4 w-4 mr-1 inline" />
                                Büyüt
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etiketler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog İstatistikleri */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedBlog.likesCount || 0}</span>
                              </div>
                    <p className="text-xs text-gray-600">Beğeni</p>
                                </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedBlog.views || 0}</span>
                              </div>
                    <p className="text-xs text-gray-600">Görüntülenme</p>
                            </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedBlog.commentCount || 0}</span>
                            </div>
                    <p className="text-xs text-gray-600">Yorum</p>
                          </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedBlog.reportCount || 0}</span>
                        </div>
                    <p className="text-xs text-gray-600">Rapor</p>
                    </div>
                  </div>

                {/* Blog Özellikleri */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Blog Özellikleri</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.isPublished && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yayınlandı
                      </span>
                    )}
                    {selectedBlog.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Öne Çıkan
                      </span>
                    )}
                    {selectedBlog.isReported && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Raporlandı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Modal */}
        {showCommentsModal && selectedBlogForComments && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                      Yorum Yönetimi
                  </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      "{selectedBlogForComments.title}" başlıklı blog'un yorumları
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCommentsModal(false);
                      setSelectedBlogForComments(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Comments Error Alert */}
                {commentsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                          <div>
                          <h3 className="text-sm font-medium text-red-800">Hata</h3>
                          <p className="text-sm text-red-700 mt-1">{commentsError}</p>
                          </div>
                        </div>
                        <button
                        onClick={clearCommentsError}
                        className="text-red-400 hover:text-red-600"
                        >
                        <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                )}

                {/* Comments Table */}
                <CommentsTable
                  comments={comments}
                  loading={commentsLoading}
                  onDelete={handleDeleteComment}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}