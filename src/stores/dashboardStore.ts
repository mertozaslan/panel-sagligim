import { create } from 'zustand';
import { dashboardService, DashboardStats } from '@/services/dashboard';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface DashboardActions {
  fetchDashboardStats: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await dashboardService.getDashboardStats();
      set({ 
        stats, 
        loading: false, 
        lastUpdated: new Date(),
        error: null 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Dashboard verileri yüklenirken bir hata oluştu.', 
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
