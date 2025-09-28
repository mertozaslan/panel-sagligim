import api from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
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
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

// Auth servisleri
export const authService = {
  // Kullanıcı girişi
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Token yenileme
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Kullanıcı profili getir
  getProfile: async (): Promise<{ user: UserProfile }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Çıkış yapma
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};