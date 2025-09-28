import { create } from 'zustand';
import { eventsService, Event, EventsQueryParams, EventStats } from '@/services/events';

interface EventsState {
  // Data
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  stats: EventStats | null;
  selectedEvent: Event | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error state
  error: string | null;

  // Filters
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  typeFilter: string;

  // Actions
  getAllEvents: (queryParams?: EventsQueryParams) => Promise<void>;
  getEventById: (eventId: string) => Promise<void>;
  createEvent: (eventData: any) => Promise<void>;
  updateEvent: (eventId: string, eventData: any) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventStats: () => Promise<void>;
  searchEvents: (searchTerm: string) => Promise<void>;
  approveEvent: (eventId: string, approvalData: { action: 'approve' | 'reject'; reason?: string }) => Promise<void>;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  setTypeFilter: (type: string) => void;
  
  // Utility actions
  setSelectedEvent: (event: Event | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  // Initial state
  events: [],
  pagination: null,
  stats: null,
  selectedEvent: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  categoryFilter: 'all',
  typeFilter: 'all',

  // Get all events
  getAllEvents: async (queryParams: EventsQueryParams = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const { searchTerm, statusFilter, categoryFilter, typeFilter } = get();
      
      const params: EventsQueryParams = {
        ...queryParams,
        search: searchTerm || undefined,
        status: statusFilter as any,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        isOnline: typeFilter === 'online' ? true : typeFilter === 'offline' ? false : undefined,
      };

      const response = await eventsService.getAllEvents(params);
      
      set({
        events: response.events,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Etkinlikler yüklenirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (eventId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await eventsService.getEventById(eventId);
      
      set({
        selectedEvent: response.event,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Etkinlik detayı yüklenirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Create event
  createEvent: async (eventData: any) => {
    try {
      set({ isCreating: true, error: null });
      
      const response = await eventsService.createEvent(eventData);
      
      // Add new event to the list
      const { events } = get();
      set({
        events: [response.event, ...events],
        isCreating: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isCreating: false,
        error: error.response?.data?.message || 'Etkinlik oluşturulurken bir hata oluştu',
      });
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId: string, eventData: any) => {
    try {
      set({ isUpdating: true, error: null });
      
      console.log('Store updateEvent - eventId:', eventId); // Debug için
      
      const response = await eventsService.updateEvent(eventId, eventData);
      
      // Update event in the list
      const { events } = get();
      const updatedEvents = events.map(event => {
        const currentEventId = event.id || (event as any)._id;
        return currentEventId === eventId ? response.event : event;
      });
      
      set({
        events: updatedEvents,
        selectedEvent: response.event,
        isUpdating: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isUpdating: false,
        error: error.response?.data?.message || 'Etkinlik güncellenirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId: string) => {
    try {
      set({ isDeleting: true, error: null });
      
      console.log('Store deleteEvent - eventId:', eventId); // Debug için
      
      await eventsService.deleteEvent(eventId);
      
      // Remove event from the list
      const { events } = get();
      const filteredEvents = events.filter(event => {
        const currentEventId = event.id || (event as any)._id;
        return currentEventId !== eventId;
      });
      
      set({
        events: filteredEvents,
        selectedEvent: null,
        isDeleting: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isDeleting: false,
        error: error.response?.data?.message || 'Etkinlik silinirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Get event stats
  getEventStats: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await eventsService.getEventStats();
      
      set({
        stats: response.stats,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'İstatistikler yüklenirken bir hata oluştu',
      });
      throw error;
    }
  },

  // Search events
  searchEvents: async (searchTerm: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await eventsService.searchEvents({ q: searchTerm });
      
      set({
        events: response.events,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Etkinlik arama sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  // Approve/Reject event
  approveEvent: async (eventId: string, approvalData: { action: 'approve' | 'reject'; reason?: string }) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('Store approveEvent - eventId:', eventId); // Debug için
      
      const response = await eventsService.approveEvent(eventId, approvalData);
      
      // Update event in the list
      const { events } = get();
      const updatedEvents = events.map(event => {
        const currentEventId = event.id || (event as any)._id;
        return currentEventId === eventId ? response.event : event;
      });
      
      set({
        events: updatedEvents,
        selectedEvent: response.event,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Etkinlik onaylama/reddetme sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  // Filter actions
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  setCategoryFilter: (category: string) => {
    set({ categoryFilter: category });
  },

  setTypeFilter: (type: string) => {
    set({ typeFilter: type });
  },

  // Utility actions
  setSelectedEvent: (event: Event | null) => {
    set({ selectedEvent: event });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
