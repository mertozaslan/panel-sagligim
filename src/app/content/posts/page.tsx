'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentModerationTable from '@/components/content/ContentModerationTable';
import CommentsTable from '@/components/content/CommentsTable';
import { Post, PostCategory, Comment } from '@/types';
import { usePostsStore } from '@/stores/postsStore';
import { useCommentsStore } from '@/stores/commentsStore';
import { Search, XCircle, Eye, Heart, MessageSquare, AlertTriangle, MessageCircle } from 'lucide-react';
import Swal from 'sweetalert2';

// Post kategorileri
const postCategories: { value: PostCategory; label: string }[] = [
  { value: 'diabetes', label: 'Diyabet' },
  { value: 'heart-disease', label: 'Kalp Hastalıkları' },
  { value: 'cancer', label: 'Kanser' },
  { value: 'mental-health', label: 'Ruh Sağlığı' },
  { value: 'arthritis', label: 'Artrit' },
  { value: 'asthma', label: 'Astım' },
  { value: 'digestive', label: 'Sindirim Sistemi' },
  { value: 'neurological', label: 'Nörolojik Hastalıklar' },
  { value: 'autoimmune', label: 'Otoimmün Hastalıklar' },
  { value: 'other', label: 'Diğer' },
];

export default function PostsPage() {
  const {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    deletePost,
    updatePost,
    setFilters,
    clearError,
  } = usePostsStore();

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);

  // Component mount olduğunda posts'ları yükle
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filtreler değiştiğinde posts'ları yeniden yükle
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };
    
    setFilters(filters);
    fetchPosts(filters);
  }, [searchTerm, categoryFilter]);

  const filteredPosts = posts;


  const handleDelete = async (item: any) => {
    const post = item as Post;
    // API'den gelen _id'yi id olarak kullan
    const postId = post.id || (post as any)._id;
    
    const result = await Swal.fire({
      title: 'Post\'u Sil',
      html: `"${post.title}" başlıklı post\'u silmek istediğinizden emin misiniz?`,
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
        await deletePost(postId);
        
        // Posts listesini yeniden fetch et
        await fetchPosts();
        
        Swal.fire({
          title: 'Başarıyla Silindi!',
          html: 'Post başarıyla silindi.',
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
        console.error('Post silme hatası:', error);
        
        Swal.fire({
          title: 'Hata!',
          html: 'Post silinirken bir hata oluştu.',
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
    const post = item as Post;
    // API'den gelen _id'yi id olarak kullan
    const postWithId = {
      ...post,
      id: post.id || (post as any)._id
    };
    setSelectedPost(postWithId);
    setShowDetailModal(true);
  };

  const handleEdit = (item: any) => {
    const post = item as Post;
    // API'den gelen _id'yi id olarak kullan
    const postWithId = {
      ...post,
      id: post.id || (post as any)._id
    };
    setEditingPost(postWithId);
    setShowEditModal(true);
  };

  const handleViewComments = (item: any) => {
    const post = item as Post;
    // API'den gelen _id'yi id olarak kullan
    const postWithId = {
      ...post,
      id: post.id || (post as any)._id
    };
    setSelectedPostForComments(postWithId);
    setShowCommentsModal(true);
    // Post'un yorumlarını yükle
    fetchCommentsByPost(postWithId.id);
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
      title="Paylaşımlar"
      subtitle="Kullanıcı ve uzman paylaşımlarını inceleyin ve yönetin"
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
                  placeholder="Paylaşım ara..."
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
                  {postCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-600">Toplam Paylaşım</div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Post'lar yükleniyor...</p>
          </div>
        ) : (
        <ContentModerationTable
          items={filteredPosts}
          onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewComments={handleViewComments}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Post Düzenle
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
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik
                  </label>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({...editingPost, category: e.target.value as PostCategory})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  >
                    {postCategories.map((category) => (
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
                    value={Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : editingPost.tags || ''}
                    onChange={(e) => setEditingPost({...editingPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    placeholder="etiket1, etiket2, etiket3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Post Özellikleri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPost.isAnonymous}
                          onChange={(e) => setEditingPost({...editingPost, isAnonymous: e.target.checked})}
                          className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Anonim</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Yazar bilgileri gizlenir</p>
                        </div>
                      </label>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPost.isSensitive}
                          onChange={(e) => setEditingPost({...editingPost, isSensitive: e.target.checked})}
                          className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Hassas İçerik</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Duyarlı konular içerir</p>
                        </div>
                      </label>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPost.medicalAdvice}
                          onChange={(e) => setEditingPost({...editingPost, medicalAdvice: e.target.checked})}
                          className="mt-1 h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Tıbbi Tavsiye</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Sağlık önerileri içerir</p>
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
                        await updatePost(editingPost.id, {
                          title: editingPost.title,
                          content: editingPost.content,
                          category: editingPost.category,
                          tags: editingPost.tags,
                          isAnonymous: editingPost.isAnonymous,
                          isSensitive: editingPost.isSensitive,
                          medicalAdvice: editingPost.medicalAdvice,
                        });
                        
                        // Posts listesini yeniden fetch et
                        await fetchPosts();
                        
                        setShowEditModal(false);
                        
                        Swal.fire({
                          title: 'Başarıyla Güncellendi!',
                          html: 'Post başarıyla güncellendi.',
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
                        console.error('Post güncelleme hatası:', error);
                        
                        Swal.fire({
                          title: 'Hata!',
                          html: 'Post güncellenirken bir hata oluştu.',
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

        {/* Detail Modal */}
        {showDetailModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Paylaşım Detayları
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedPost.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>Yazar: {selectedPost.author.firstName} {selectedPost.author.lastName} (@{selectedPost.author.username})</span>
                    <span>Kategori: {postCategories.find(c => c.value === selectedPost.category)?.label}</span>
                    <span>Tarih: {new Date(selectedPost.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>
                  
                  {/* Post Resimleri */}
                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Post Resimleri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedPost.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`https://api.saglikhep.com${image}`}
                              alt={`Post resmi ${index + 1}`}
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

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etiketler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
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

                {/* Post İstatistikleri */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedPost.likes?.length || 0}</span>
                    </div>
                    <p className="text-xs text-gray-600">Beğeni</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedPost.views || 0}</span>
                    </div>
                    <p className="text-xs text-gray-600">Görüntülenme</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedPost.dislikes?.length || 0}</span>
                    </div>
                    <p className="text-xs text-gray-600">Beğenmeme</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedPost.reportCount || 0}</span>
                    </div>
                    <p className="text-xs text-gray-600">Rapor</p>
                  </div>
                </div>

                {/* Post Özellikleri */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Post Özellikleri</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.isAnonymous && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Anonim
                      </span>
                    )}
                    {selectedPost.isSensitive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Hassas İçerik
                      </span>
                    )}
                    {selectedPost.medicalAdvice && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Tıbbi Tavsiye
                      </span>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}

        {/* Comments Modal */}
        {showCommentsModal && selectedPostForComments && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Yorum Yönetimi
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      "{selectedPostForComments.title}" başlıklı post'un yorumları
                    </p>
                  </div>
                    <button
                      onClick={() => {
                      setShowCommentsModal(false);
                      setSelectedPostForComments(null);
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
