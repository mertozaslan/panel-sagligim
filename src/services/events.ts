import api from '@/lib/axios';

// Event interfaces
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorTitle?: string;
  date: string;
  endDate: string;
  location?: string;
  locationAddress?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  isOnline: boolean;
  organizer: string;
  organizerType: 'government' | 'private' | 'ngo' | 'individual' | 'hospital' | 'university';
  tags: string[];
  requirements?: string;
  publishDate: string;
  status: 'pending' | 'active' | 'full' | 'completed' | 'cancelled' | 'rejected';
  authorId: string;
  image?: string;
  isRegistered?: boolean;
  canRegister?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  pendingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  averageParticipants: number;
  categoryStats: Array<{
    category: string;
    count: number;
    totalParticipants: number;
  }>;
  organizerStats: Array<{
    organizerType: string;
    count: number;
    totalParticipants: number;
  }>;
}

export interface EventsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'all' | 'pending' | 'active' | 'full' | 'completed' | 'cancelled' | 'rejected';
  isOnline?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface SearchEventsParams {
  q?: string;
  category?: string;
  location?: string;
  isOnline?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorTitle?: string;
  date: string;
  endDate: string;
  location?: string;
  locationAddress?: string;
  maxParticipants: number;
  price: number;
  isOnline: boolean;
  organizer: string;
  organizerType: 'government' | 'private' | 'ngo' | 'individual' | 'hospital' | 'university';
  tags: string[];
  requirements?: string;
  image?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  category?: string;
  instructor?: string;
  instructorTitle?: string;
  date?: string;
  endDate?: string;
  location?: string;
  locationAddress?: string;
  maxParticipants?: number;
  price?: number;
  isOnline?: boolean;
  organizer?: string;
  organizerType?: 'government' | 'private' | 'ngo' | 'individual' | 'hospital' | 'university';
  requirements?: string;
  tags?: string[];
}

export interface EventRegistrationData {
  notes?: string;
}

export interface EventApprovalData {
  action: 'approve' | 'reject';
  reason?: string;
}

export interface EventReportData {
  reason: 'spam' | 'inappropriate' | 'false_information' | 'other';
  description?: string;
}

export const eventsService = {
  // Tüm etkinlikleri getir
  getAllEvents: async (queryParams: EventsQueryParams = {}): Promise<EventsResponse> => {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      isOnline,
      sortBy = 'date',
      sortOrder = 'asc',
      search
    } = queryParams;

    const params: any = { page, limit, sortBy, sortOrder };

    if (category) params.category = category;
    if (status) params.status = status;
    if (typeof isOnline === 'boolean') params.isOnline = isOnline;
    if (search) params.search = search;

    const response = await api.get('/events', { params });
    return response.data;
  },

  // Etkinlik arama
  searchEvents: async (searchParams: SearchEventsParams = {}): Promise<EventsResponse> => {
    const {
      q,
      category,
      location,
      isOnline,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = searchParams;

    const params: any = { page, limit };

    if (q) params.q = q;
    if (category) params.category = category;
    if (location) params.location = location;
    if (typeof isOnline === 'boolean') params.isOnline = isOnline;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const response = await api.get('/events/search', { params });
    return response.data;
  },

  // Etkinlik detayı
  getEventById: async (eventId: string): Promise<{ event: Event }> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Etkinlik oluştur
  createEvent: async (eventData: CreateEventData): Promise<{ message: string; event: Event }> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Etkinlik güncelle
  updateEvent: async (eventId: string, eventData: UpdateEventData): Promise<{ message: string; event: Event }> => {
    console.log('Service updateEvent - eventId:', eventId); // Debug için
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Etkinlik sil
  deleteEvent: async (eventId: string): Promise<{ message: string }> => {
    console.log('Service deleteEvent - eventId:', eventId); // Debug için
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Etkinliğe kayıt ol
  registerForEvent: async (eventId: string, registrationData: EventRegistrationData = {}): Promise<{
    message: string;
    registration: any;
    event: Event;
  }> => {
    const response = await api.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  },

  // Etkinlik kaydını iptal et
  unregisterFromEvent: async (eventId: string): Promise<{ message: string; event: Event }> => {
    const response = await api.delete(`/events/${eventId}/unregister`);
    return response.data;
  },

  // Kullanıcının etkinlikleri
  getUserEvents: async (filters: {
    type?: 'created' | 'registered';
    status?: 'active' | 'completed';
    page?: number;
    limit?: number;
  } = {}): Promise<EventsResponse> => {
    const { type, status, page = 1, limit = 10 } = filters;
    const params: any = { page, limit };

    if (type) params.type = type;
    if (status) params.status = status;

    const response = await api.get('/events/my-events', { params });
    return response.data;
  },

  // Etkinlik istatistikleri (Admin)
  getEventStats: async (): Promise<{ stats: EventStats }> => {
    const response = await api.get('/events/stats');
    return response.data;
  },

  // Etkinlik katılımcıları
  getEventParticipants: async (eventId: string, filters: {
    page?: number;
    limit?: number;
    status?: 'confirmed' | 'pending';
  } = {}): Promise<{
    participants: any[];
    pagination: any;
  }> => {
    const { page = 1, limit = 10, status } = filters;
    const params: any = { page, limit };

    if (status) params.status = status;

    const response = await api.get(`/events/${eventId}/participants`, { params });
    return response.data;
  },

  // Etkinlik onaylama/reddetme (Admin)
  approveEvent: async (eventId: string, approvalData: EventApprovalData): Promise<{
    message: string;
    event: Event;
  }> => {
    console.log('Service approveEvent - eventId:', eventId); // Debug için
    const response = await api.put(`/events/${eventId}/approve`, approvalData);
    return response.data;
  },

  // Etkinlik raporlama
  reportEvent: async (eventId: string, reportData: EventReportData): Promise<{ message: string }> => {
    const response = await api.post(`/events/${eventId}/report`, reportData);
    return response.data;
  }
};
