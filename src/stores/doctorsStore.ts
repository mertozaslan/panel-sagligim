import { create } from 'zustand';
import { doctorsService, PendingDoctor, PendingDoctorsResponse } from '@/services/doctors';

interface DoctorsState {
  // State
  pendingDoctors: PendingDoctor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPending: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;

  // Actions
  getPendingDoctors: (page?: number, limit?: number) => Promise<void>;
  approveDoctor: (doctorId: string) => Promise<void>;
  rejectDoctor: (doctorId: string, rejectionReason?: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  resetDoctors: () => void;
}

export const useDoctorsStore = create<DoctorsState>((set, get) => ({
  // Initial state
  pendingDoctors: [],
  pagination: null,
  isLoading: false,
  error: null,
  searchTerm: '',

  // Actions
  getPendingDoctors: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      
      const response: PendingDoctorsResponse = await doctorsService.getPendingDoctors(page, limit);
      
      set({
        pendingDoctors: response.pendingDoctors,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Doktorlar yüklenirken bir hata oluştu',
      });
      throw error;
    }
  },

  approveDoctor: async (doctorId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await doctorsService.approveDoctor(doctorId);
      
      // Onaylanan doktoru listeden çıkar
      const { pendingDoctors } = get();
      const updatedDoctors = pendingDoctors.filter(doctor => doctor._id !== doctorId);
      
      set({
        pendingDoctors: updatedDoctors,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Doktor onaylanırken bir hata oluştu',
      });
      throw error;
    }
  },

  rejectDoctor: async (doctorId: string, rejectionReason?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await doctorsService.rejectDoctor(doctorId, { rejectionReason });
      
      // Reddedilen doktoru listeden çıkar
      const { pendingDoctors } = get();
      const updatedDoctors = pendingDoctors.filter(doctor => doctor._id !== doctorId);
      
      set({
        pendingDoctors: updatedDoctors,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Doktor reddedilirken bir hata oluştu',
      });
      throw error;
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  resetDoctors: () => {
    set({
      pendingDoctors: [],
      pagination: null,
      searchTerm: '',
      error: null,
    });
  },
}));
