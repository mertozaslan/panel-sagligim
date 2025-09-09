'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Event } from '@/types';
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
  Monitor
} from 'lucide-react';
import { clsx } from 'clsx';

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Sağlıklı Beslenme Semineri',
    description: 'Uzmanlarımızla birlikte sağlıklı beslenme alışkanlıkları üzerine interaktif seminer',
    organizerId: '1',
    organizer: { id: '1', name: 'Admin', email: 'admin@saglikhep.com', role: 'admin', status: 'active', createdAt: new Date() },
    category: 'seminar',
    type: 'online',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    startDate: new Date('2024-01-25T14:00:00'),
    endDate: new Date('2024-01-25T16:00:00'),
    maxParticipants: 50,
    currentParticipants: 32,
    status: 'published',
    participants: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Stres Yönetimi Atölyesi',
    description: 'Stresle başa çıkma teknikleri ve mindfulness uygulamaları',
    organizerId: '2',
    organizer: { id: '2', name: 'Dr. Ayşe Kaya', email: 'dr.ayse@email.com', role: 'expert', status: 'active', createdAt: new Date() },
    category: 'workshop',
    type: 'offline',
    location: 'Sağlık Merkezi - Konferans Salonu',
    startDate: new Date('2024-01-28T10:00:00'),
    endDate: new Date('2024-01-28T12:00:00'),
    maxParticipants: 20,
    currentParticipants: 15,
    status: 'published',
    participants: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Kardiyovasküler Sağlık Kontrolü',
    description: 'Uzman kardiyolog eşliğinde grup konsültasyonu ve sağlık taraması',
    organizerId: '3',
    organizer: { id: '3', name: 'Dr. Can Özkan', email: 'dr.can@email.com', role: 'expert', status: 'active', createdAt: new Date() },
    category: 'consultation',
    type: 'hybrid',
    location: 'Kardiyoloji Kliniği',
    meetingLink: 'https://zoom.us/j/123456789',
    startDate: new Date('2024-02-02T09:00:00'),
    endDate: new Date('2024-02-02T11:00:00'),
    maxParticipants: 15,
    currentParticipants: 8,
    status: 'draft',
    participants: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEdit = (event: Event) => {
    console.log('Edit event:', event);
    // TODO: Implement edit functionality
  };

  const handleDelete = (event: Event) => {
    setEvents(events.filter(e => e.id !== event.id));
  };

  const getStatusBadge = (status: Event['status']) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    const statusText = {
      draft: 'Taslak',
      published: 'Yayında',
      cancelled: 'İptal',
      completed: 'Tamamlandı'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status]
      )}>
        {statusText[status]}
      </span>
    );
  };

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'online':
        return <Monitor className="h-4 w-4" />;
      case 'offline':
        return <MapPin className="h-4 w-4" />;
      case 'hybrid':
        return <Globe className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const publishedCount = events.filter(e => e.status === 'published').length;
  const draftCount = events.filter(e => e.status === 'draft').length;
  const totalParticipants = events.reduce((sum, e) => sum + e.currentParticipants, 0);

  return (
    <DashboardLayout 
      title="Etkinlik Yönetimi"
      subtitle="Sağlık etkinliklerini organize edin ve yönetin"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div></div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-health-600 hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500">
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
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="online">Online</option>
                  <option value="offline">Yüz Yüze</option>
                  <option value="hybrid">Hibrit</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{events.length}</div>
            <div className="text-sm text-gray-600">Toplam Etkinlik</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            <div className="text-sm text-gray-600">Yayında</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{draftCount}</div>
            <div className="text-sm text-gray-600">Taslak</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{totalParticipants}</div>
            <div className="text-sm text-gray-600">Toplam Katılımcı</div>
          </div>
        </div>

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
                            {getTypeIcon(event.type)}
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
                            {event.type === 'online' && <Monitor className="h-3 w-3 mr-1" />}
                            {event.type === 'offline' && <MapPin className="h-3 w-3 mr-1" />}
                            {event.type === 'hybrid' && <Globe className="h-3 w-3 mr-1" />}
                            <span>
                              {event.type === 'online' ? 'Online' : 
                               event.type === 'offline' ? 'Yüz Yüze' : 'Hibrit'}
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
                        {event.organizer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.organizer.role === 'expert' ? 'Uzman' : 'Admin'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(event.startDate, 'dd MMM yyyy', { locale: tr })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {event.currentParticipants}
                          {event.maxParticipants && `/${event.maxParticipants}`}
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
                        <span>{format(selectedEvent.startDate, 'dd MMMM yyyy, HH:mm', { locale: tr })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>
                          {format(selectedEvent.endDate, 'HH:mm')} kadar 
                          ({Math.floor((selectedEvent.endDate.getTime() - selectedEvent.startDate.getTime()) / (1000 * 60 * 60))} saat)
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(selectedEvent.type)}
                        <span className="ml-2">
                          {selectedEvent.type === 'online' ? 'Online' : 
                           selectedEvent.type === 'offline' ? 'Yüz Yüze' : 'Hibrit'}
                        </span>
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                      {selectedEvent.meetingLink && (
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 text-gray-400 mr-2" />
                          <a href={selectedEvent.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            Toplantı Bağlantısı
                          </a>
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
                          {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants || '∞'} katılımcı
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-health-600 h-2 rounded-full" 
                          style={{ 
                            width: selectedEvent.maxParticipants 
                              ? `${(selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100}%`
                              : '50%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Organizatör</h4>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-health-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-health-600">
                        {selectedEvent.organizer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{selectedEvent.organizer.name}</div>
                      <div className="text-sm text-gray-500">{selectedEvent.organizer.email}</div>
                    </div>
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
