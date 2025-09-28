'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentModerationTable from '@/components/content/ContentModerationTable';
import { Post } from '@/types';
import { Search, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Sağlıklı Beslenme İpuçları',
    content: 'Günlük yaşamımızda sağlıklı beslenme alışkanlıkları geliştirmek için önemli ipuçları...',
    excerpt: 'Sağlıklı beslenme alışkanlıkları hakkında detaylı bilgiler',
    authorId: '1',
    author: { id: '1', name: 'Ayşe Kaya', email: 'ayse@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'nutrition',
    tags: ['beslenme', 'sağlık', 'diyet'],
    status: 'pending',
    publishedAt: undefined,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    likes: 0,
    views: 0,
    comments: []
  },
  {
    id: '2',
    title: 'Egzersiz ve Kalp Sağlığı',
    content: 'Düzenli egzersizin kalp sağlığı üzerindeki olumlu etkileri ve öneriler...',
    excerpt: 'Kalp sağlığı için egzersiz önerileri',
    authorId: '2',
    author: { id: '2', name: 'Dr. Mehmet Yılmaz', email: 'dr.mehmet@email.com', role: 'expert', status: 'active', createdAt: new Date() },
    category: 'fitness',
    tags: ['egzersiz', 'kalp', 'sağlık'],
    status: 'pending',
    publishedAt: undefined,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    likes: 0,
    views: 0,
    comments: []
  },
  {
    id: '3',
    title: 'Stres Yönetimi Teknikleri',
    content: 'Günlük hayatta stresle başa çıkma yöntemleri ve rahatlama teknikleri...',
    excerpt: 'Stres yönetimi için pratik çözümler',
    authorId: '3',
    author: { id: '3', name: 'Zeynep Ak', email: 'zeynep@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'mental-health',
    tags: ['stres', 'zihinsel-sağlık', 'rahatlama'],
    status: 'approved',
    publishedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    likes: 15,
    views: 234,
    comments: []
  },
  {
    id: '4',
    title: 'Uyku Düzeni ve Sağlık',
    content: 'Kaliteli uykunun sağlık üzerindeki etkileri ve uyku hijyeni önerileri...',
    excerpt: 'Sağlıklı uyku düzeni için ipuçları',
    authorId: '4',
    author: { id: '4', name: 'Can Demir', email: 'can@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'wellness',
    tags: ['uyku', 'sağlık', 'yaşam-tarzı'],
    status: 'pending',
    publishedAt: undefined,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    likes: 0,
    views: 0,
    comments: []
  }
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApprove = (item: any) => {
    const post = item as Post;
    setPosts(posts.map(p => 
      p.id === post.id 
        ? { ...p, status: 'approved', publishedAt: new Date() }
        : p
    ));
  };

  const handleReject = (item: any) => {
    const post = item as Post;
    setPosts(posts.map(p => 
      p.id === post.id 
        ? { ...p, status: 'rejected' }
        : p
    ));
  };

  const handleView = (item: any) => {
    const post = item as Post;
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  const pendingCount = posts.filter(p => p.status === 'pending').length;
  const approvedCount = posts.filter(p => p.status === 'approved').length;
  const rejectedCount = posts.filter(p => p.status === 'rejected').length;

  return (
    <DashboardLayout 
      title="Paylaşımlar"
      subtitle="Kullanıcı ve uzman paylaşımlarını inceleyin ve yönetin"
    >
      <div className="space-y-6">
        {/* Alert for pending posts */}
        {pendingCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {pendingCount} paylaşım moderasyon bekliyor
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Paylaşımları inceleyin ve uygun olanları onaylayın.
                </p>
              </div>
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

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="pending">Bekleyen</option>
                  <option value="approved">Onaylanan</option>
                  <option value="rejected">Reddedilen</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  <option value="nutrition">Beslenme</option>
                  <option value="fitness">Fitness</option>
                  <option value="mental-health">Ruh Sağlığı</option>
                  <option value="lifestyle">Yaşam Tarzı</option>
                  <option value="diseases">Hastalıklar</option>
                  <option value="prevention">Korunma</option>
                  <option value="wellness">Sağlık</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Gelişmiş Filtre
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-600">Toplam Paylaşım</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Bekleyen</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Onaylanan</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Reddedilen</div>
          </div>
        </div>

        {/* Posts Table */}
        <ContentModerationTable
          items={filteredPosts}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleView}
        />

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
                    <span>Yazar: {selectedPost.author.name}</span>
                    <span>Kategori: {selectedPost.category}</span>
                    <span>Tarih: {selectedPost.createdAt.toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>
                </div>

                {selectedPost.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etiketler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.status === 'pending' && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleReject(selectedPost);
                        setShowDetailModal(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reddet
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedPost);
                        setShowDetailModal(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Onayla
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
