import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, LoginCredentials } from '@/services/auth';

// Auth service'den gelen user tipi
type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  profilePicture: string;
  bio: string;
};

interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false, // Başlangıçta loading false
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login(credentials);
          
          // Token'ları localStorage'a kaydet
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { token } = get();
          if (token) {
            await authService.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Her durumda state'i temizle
          localStorage.clear();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.getProfile();
          
          set({
            user: response.user as unknown as AuthUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Profil bilgileri alınırken bir hata oluştu',
          });
          throw error;
        }
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('Refresh token bulunamadı');
          }

          const response = await authService.refreshToken(refreshToken);
          
          // Yeni token'ları kaydet
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // Refresh token da geçersizse logout yap
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        // isLoading ve error persist edilmemeli, her sayfa yüklendiğinde sıfırlanmalı
      }),
    }
  )
);