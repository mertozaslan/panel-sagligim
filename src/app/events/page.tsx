'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Event } from '@/types';
import { useEventsStore } from '@/stores/eventsStore';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Clock,
  Globe,
  Monitor,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

export default function EventsPage() {
  const {
    events,
    pagination,
    stats,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    categoryFilter,
    typeFilter,
    selectedEvent,
    getAllEvents,
    getEventStats,
    createEvent,
    updateEvent,
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setTypeFilter,
    setSelectedEvent,
    deleteEvent,
    approveEvent,
    clearError,
  } = useEventsStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvingEvent, setApprovingEvent] = useState<Event | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalReason, setApprovalReason] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    instructorTitle: '',
    date: '',
    endDate: '',
    location: '',
    locationAddress: '',
    maxParticipants: 1,
    price: 0,
    isOnline: false,
    organizer: '',
    organizerType: '',
    requirements: '',
    tags: [] as string[]
  });

  // Sayfa yüklendiğinde etkinlikleri getir
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: 10,
      status: statusFilter as any,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      isOnline: typeFilter === 'online' ? true : typeFilter === 'offline' ? false : undefined,
      search: searchTerm || undefined,
    };
    
    getAllEvents(queryParams);
    getEventStats();
  }, [currentPage, statusFilter, categoryFilter, typeFilter, searchTerm, getAllEvents, getEventStats]);

  // Arama işlemi
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Filtreleme işlemleri
  const handleStatusFilter = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEdit = (event: Event) => {
    console.log('Handle edit event:', event); // Debug için
    setEditingEvent(event);
    
    // Tarih formatını düzelt - datetime-local input için
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      instructor: event.instructor,
      instructorTitle: event.instructorTitle || '',
      date: formatDateForInput(event.date),
      endDate: formatDateForInput(event.endDate),
      location: event.location || '',
      locationAddress: event.locationAddress || '',
      maxParticipants: event.maxParticipants,
      price: event.price,
      isOnline: event.isOnline,
      organizer: event.organizer,
      organizerType: event.organizerType,
      requirements: event.requirements || '',
      tags: event.tags || []
    });
    setShowEditModal(true);
  };

  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      instructor: '',
      instructorTitle: '',
      date: '',
      endDate: '',
      location: '',
      locationAddress: '',
      maxParticipants: 1,
      price: 0,
      isOnline: false,
      organizer: '',
      organizerType: '',
      requirements: '',
      tags: []
    });
    setShowCreateModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowApprovalModal(false);
    setEditingEvent(null);
    setApprovingEvent(null);
    setApprovalReason('');
  };

  const handleApprove = (event: Event) => {
    console.log('Handle approve event:', event); // Debug için
    setApprovingEvent(event);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleReject = (event: Event) => {
    console.log('Handle reject event:', event); // Debug için
    setApprovingEvent(event);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async () => {
    if (!approvingEvent) return;
    
    console.log('Approving event:', approvingEvent); // Debug için
    console.log('Event ID:', approvingEvent.id); // Debug için
    console.log('Event _id:', (approvingEvent as any)._id); // Debug için
    
    // ID'yi kontrol et - belki _id olarak geliyor
    const eventId = approvingEvent.id || (approvingEvent as any)._id;
    
    if (!eventId) {
      console.error('Event ID bulunamadı!');
      return;
    }
    
    try {
      await approveEvent(eventId, {
        action: approvalAction,
        reason: approvalReason || undefined
      });
      handleCloseModals();
      // Refresh events list
      getAllEvents();
    } catch (error) {
      console.error('Etkinlik onaylama/reddetme hatası:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };
      
      await createEvent(eventData);
      handleCloseModals();
      // Refresh events list
      getAllEvents();
    } catch (error) {
      console.error('Etkinlik oluşturma hatası:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEvent) return;
    
    console.log('Editing event:', editingEvent); // Debug için
    console.log('Event ID:', editingEvent.id); // Debug için
    console.log('Event _id:', (editingEvent as any)._id); // Debug için
    
    // ID'yi kontrol et - belki _id olarak geliyor
    const eventId = editingEvent.id || (editingEvent as any)._id;
    
    if (!eventId) {
      console.error('Event ID bulunamadı!');
      return;
    }
    
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        instructor: formData.instructor,
        instructorTitle: formData.instructorTitle,
        date: new Date(formData.date).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        location: formData.location,
        locationAddress: formData.locationAddress,
        maxParticipants: formData.maxParticipants,
        price: formData.price,
        isOnline: formData.isOnline,
        organizer: formData.organizer,
        organizerType: formData.organizerType,
        requirements: formData.requirements,
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };
      
      await updateEvent(eventId, updateData);
      handleCloseModals();
      // Refresh events list
      getAllEvents();
    } catch (error) {
      console.error('Etkinlik güncelleme hatası:', error);
    }
  };

  const handleDelete = async (event: Event) => {
    if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      console.log('Deleting event:', event); // Debug için
      console.log('Event ID:', event.id); // Debug için
      console.log('Event _id:', (event as any)._id); // Debug için
      
      // ID'yi kontrol et - belki _id olarak geliyor
      const eventId = event.id || (event as any)._id;
      
      if (!eventId) {
        console.error('Event ID bulunamadı!');
        return;
      }
      
      try {
        await deleteEvent(eventId);
      } catch (error) {
        console.error('Etkinlik silme hatası:', error);
      }
    }
  };

  // Sayfalama
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: Event['status']) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      full: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusText = {
      pending: 'Beklemede',
      active: 'Aktif',
      full: 'Dolu',
      completed: 'Tamamlandı',
      cancelled: 'İptal',
      rejected: 'Reddedildi'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status] || 'bg-gray-100 text-gray-800'
      )}>
        {statusText[status] || status}
      </span>
    );
  };

  const getTypeIcon = (isOnline: boolean) => {
    return isOnline ? <Monitor className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  // API'den gelen veriler zaten filtrelenmiş olduğu için direkt kullan
  const filteredEvents = events;

  return (
    <DashboardLayout 
      title="Etkinlik Yönetimi"
      subtitle="Sağlık etkinliklerini organize edin ve yönetin"
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div></div>
          <button 
            onClick={handleCreateEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-health-600 hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Etkinlik
          </button>
        </div>

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
                  placeholder="Etkinlik ara..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="pending">Beklemede</option>
                  <option value="active">Aktif</option>
                  <option value="full">Dolu</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  <option value="Meditasyon">Meditasyon</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Beslenme">Beslenme</option>
                  <option value="Egzersiz">Egzersiz</option>
                  <option value="Psikoloji">Psikoloji</option>
                  <option value="Tıp">Tıp</option>
                  <option value="Alternatif Tıp">Alternatif Tıp</option>
                  <option value="Sağlık Teknolojisi">Sağlık Teknolojisi</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => handleTypeFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="online">Online</option>
                  <option value="offline">Yüz Yüze</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalEvents || events.length}
            </div>
            <div className="text-sm text-gray-600">Toplam Etkinlik</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {stats?.activeEvents || events.filter(e => e.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.pendingEvents || events.filter(e => e.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Beklemede</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalParticipants || events.reduce((sum, e) => sum + e.currentParticipants, 0)}
            </div>
            <div className="text-sm text-gray-600">Toplam Katılımcı</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Etkinlikler yükleniyor...</p>
          </div>
        ) : (
          <>
        {/* Events Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etkinlik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizatör
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih & Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Katılımcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                {getTypeIcon(event.isOnline)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description.length > 80 
                              ? event.description.slice(0, 80) + '...' 
                              : event.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                                {event.isOnline ? <Monitor className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                            <span>
                                  {event.isOnline ? 'Online' : 'Yüz Yüze'}
                            </span>
                            {event.location && (
                              <span className="ml-2">{event.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                            {event.organizer}
                      </div>
                      <div className="text-sm text-gray-500">
                            {event.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                            {format(new Date(event.date), 'dd MMM yyyy', { locale: tr })}
                      </div>
                      <div className="text-sm text-gray-500">
                            {format(new Date(event.date), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                              {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(event)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                            {event.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(event)}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Onayla"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(event)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Reddet"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}

                        <button
                          onClick={() => handleDelete(event)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">Etkinlik bulunmuyor</div>
            </div>
          )}
        </div>

            {/* Pagination */}
            {pagination && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{filteredEvents.length}</span> etkinlik gösteriliyor
                      {pagination.totalEvents && (
                        <span> (toplam {pagination.totalEvents})</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {currentPage} / {pagination.totalPages}
                      </span>
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Etkinlik Detayları
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedEvent.title}</h3>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etkinlik Bilgileri</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{format(new Date(selectedEvent.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>
                          {format(new Date(selectedEvent.endDate), 'HH:mm')} kadar 
                          ({Math.floor((new Date(selectedEvent.endDate).getTime() - new Date(selectedEvent.date).getTime()) / (1000 * 60 * 60))} saat)
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(selectedEvent.isOnline)}
                        <span className="ml-2">
                          {selectedEvent.isOnline ? 'Online' : 'Yüz Yüze'}
                        </span>
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                      {selectedEvent.locationAddress && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedEvent.locationAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Katılım Bilgileri</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>
                          {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants} katılımcı
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-health-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">Fiyat: {selectedEvent.price === 0 ? 'Ücretsiz' : `${selectedEvent.price} TL`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Organizatör & Eğitmen</h4>
                  <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-health-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-health-600">
                          {selectedEvent.organizer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{selectedEvent.organizer}</div>
                        <div className="text-sm text-gray-500">Organizatör</div>
                    </div>
                  </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {selectedEvent.instructor.split(' ').map(n => n[0]).join('')}
                        </span>
                </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{selectedEvent.instructor}</div>
                        <div className="text-sm text-gray-500">{selectedEvent.instructorTitle || 'Eğitmen'}</div>
              </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etiketler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.requirements && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Gereksinimler</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.requirements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Yeni Etkinlik Oluştur
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Etkinlik Başlığı *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="Etkinlik başlığını girin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kategori *
                        </label>
                        <select 
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        >
                          <option value="">Kategori seçin</option>
                          <option value="Meditasyon">Meditasyon</option>
                          <option value="Yoga">Yoga</option>
                          <option value="Beslenme">Beslenme</option>
                          <option value="Egzersiz">Egzersiz</option>
                          <option value="Psikoloji">Psikoloji</option>
                          <option value="Tıp">Tıp</option>
                          <option value="Alternatif Tıp">Alternatif Tıp</option>
                          <option value="Sağlık Teknolojisi">Sağlık Teknolojisi</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama *
                      </label>
                      <textarea
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        placeholder="Etkinlik açıklamasını girin"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eğitmen *
                        </label>
                        <input
                          type="text"
                          name="instructor"
                          value={formData.instructor}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="Eğitmen adı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eğitmen Unvanı
                        </label>
                        <input
                          type="text"
                          name="instructorTitle"
                          value={formData.instructorTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="Dr., Prof., Uzm. Dr. vb."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi *
                        </label>
                        <input
                          type="datetime-local"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi *
                        </label>
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maksimum Katılımcı *
                        </label>
                        <input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleInputChange}
                          min="1"
                          max="1000"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fiyat (TL)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="0 (ücretsiz)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizatör *
                        </label>
                        <input
                          type="text"
                          name="organizer"
                          value={formData.organizer}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                          placeholder="Organizatör adı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizatör Tipi *
                        </label>
                        <select 
                          name="organizerType"
                          value={formData.organizerType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        >
                          <option value="">Tip seçin</option>
                          <option value="government">Devlet Kurumu</option>
                          <option value="private">Özel Şirket</option>
                          <option value="ngo">STK</option>
                          <option value="individual">Bireysel</option>
                          <option value="hospital">Hastane</option>
                          <option value="university">Üniversite</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etkinlik Türü *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isOnline" 
                            value="true"
                            checked={formData.isOnline === true}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.value === 'true' }))}
                            className="mr-2" 
                          />
                          <span>Online</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isOnline" 
                            value="false"
                            checked={formData.isOnline === false}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.value === 'true' }))}
                            className="mr-2" 
                          />
                          <span>Yüz Yüze</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasyon *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        placeholder="Etkinlik lokasyonu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasyon Adresi
                      </label>
                      <input
                        type="text"
                        name="locationAddress"
                        value={formData.locationAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        placeholder="Detaylı adres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gereksinimler
                      </label>
                      <textarea
                        rows={2}
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        placeholder="Katılımcıların getirmesi gerekenler..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseModals}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-health-600 text-white rounded-md hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500"
                      >
                        Etkinlik Oluştur
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Etkinlik Düzenle
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Etkinlik Başlığı *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kategori *
                        </label>
                        <select 
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        >
                          <option value="Meditasyon">Meditasyon</option>
                          <option value="Yoga">Yoga</option>
                          <option value="Beslenme">Beslenme</option>
                          <option value="Egzersiz">Egzersiz</option>
                          <option value="Psikoloji">Psikoloji</option>
                          <option value="Tıp">Tıp</option>
                          <option value="Alternatif Tıp">Alternatif Tıp</option>
                          <option value="Sağlık Teknolojisi">Sağlık Teknolojisi</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama *
                      </label>
                      <textarea
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eğitmen *
                        </label>
                        <input
                          type="text"
                          name="instructor"
                          value={formData.instructor}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Eğitmen Unvanı
                        </label>
                        <input
                          type="text"
                          name="instructorTitle"
                          value={formData.instructorTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi *
                        </label>
                        <input
                          type="datetime-local"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi *
                        </label>
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maksimum Katılımcı *
                        </label>
                        <input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleInputChange}
                          min="1"
                          max="1000"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fiyat (TL)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizatör *
                        </label>
                        <input
                          type="text"
                          name="organizer"
                          value={formData.organizer}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizatör Tipi *
                        </label>
                        <select 
                          name="organizerType"
                          value={formData.organizerType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        >
                          <option value="government">Devlet Kurumu</option>
                          <option value="private">Özel Şirket</option>
                          <option value="ngo">STK</option>
                          <option value="individual">Bireysel</option>
                          <option value="hospital">Hastane</option>
                          <option value="university">Üniversite</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etkinlik Türü *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isOnline" 
                            value="true"
                            checked={formData.isOnline === true}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.value === 'true' }))}
                            className="mr-2" 
                          />
                          <span>Online</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isOnline" 
                            value="false"
                            checked={formData.isOnline === false}
                            onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.value === 'true' }))}
                            className="mr-2" 
                          />
                          <span>Yüz Yüze</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasyon *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasyon Adresi
                      </label>
                      <input
                        type="text"
                        name="locationAddress"
                        value={formData.locationAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gereksinimler
                      </label>
                      <textarea
                        rows={2}
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                        placeholder="Katılımcıların getirmesi gerekenler..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseModals}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-health-600 text-white rounded-md hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500"
                      >
                        Değişiklikleri Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && approvingEvent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {approvalAction === 'approve' ? 'Etkinliği Onayla' : 'Etkinliği Reddet'}
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Etkinlik:</h4>
                    <p className="text-sm text-gray-600">{approvingEvent.title}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {approvalAction === 'approve' ? 'Onay Notu (Opsiyonel)' : 'Red Sebebi (Opsiyonel)'}
                    </label>
                    <textarea
                      rows={3}
                      value={approvalReason}
                      onChange={(e) => setApprovalReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-health-500"
                      placeholder={approvalAction === 'approve' ? 'Onay notu...' : 'Red sebebi...'}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCloseModals}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleApprovalSubmit}
                      className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${
                        approvalAction === 'approve'
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      }`}
                    >
                      {approvalAction === 'approve' ? 'Onayla' : 'Reddet'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
