import api from '@/lib/axios';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  doctorInfo?: {
    approvalStatus: 'pending' | 'approved' | 'rejected';
    location?: string;
    specialization?: string;
    hospital?: string;
    experience?: number;
    licenseNumber?: string;
    approvalDate?: string;
    approvedBy?: string;
    rejectionReason?: string;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalFollowers: number;
  totalFollowing: number;
  accountAge: number;
  lastActive: string;
  postEngagement: number;
  commentEngagement: number;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  profilePicture?: string;
}

export interface MedicalConditionData {
  diseaseId: string;
  diagnosisDate: string;
  severity: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface MedicalCondition {
  id: string;
  disease: {
    id: string;
    name: string;
    category: string;
  };
  diagnosisDate: string;
  severity: string;
  notes?: string;
  createdAt: string;
}

// Query parametreleri interface'i
export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  role?: 'admin' | 'doctor' | 'patient' | 'user';
  isActive?: boolean;
  doctorApprovalStatus?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

// Users servisleri
export const usersService = {
  // Tüm kullanıcıları getir (Admin) - Query parametreleri ile
  getAllUsers: async (queryParams: UsersQueryParams = {}): Promise<UsersResponse> => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role,
      isActive,
      doctorApprovalStatus,
      search
    } = queryParams;

    const params: any = { page, limit, sortBy, sortOrder };
    
    // Query parametrelerini ekle
    if (role) params.role = role;
    if (typeof isActive === 'boolean') params.isActive = isActive;
    if (doctorApprovalStatus) params.doctorApprovalStatus = doctorApprovalStatus;
    if (search) params.search = search;

    const response = await api.get('/users', { params });
    return response.data;
  },

  // Kullanıcı arama
  searchUsers: async (searchTerm: string, page = 1, limit = 10): Promise<UsersResponse> => {
    const response = await api.get('/users/search', {
      params: { q: searchTerm, page, limit }
    });
    return response.data;
  },

  // Kullanıcı detayı
  getUserById: async (userId: string): Promise<{ user: User }> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Kullanıcı istatistikleri
  getUserStats: async (userId: string): Promise<{ stats: UserStats }> => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },

  // Profil güncelleme
  updateProfile: async (profileData: ProfileUpdateData): Promise<{ message: string; user: User }> => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Kullanıcı takip et/bırak
  toggleFollow: async (userId: string): Promise<{ message: string; isFollowing: boolean; followersCount: number }> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Hastalık ekleme
  addMedicalCondition: async (conditionData: MedicalConditionData): Promise<{ message: string; medicalCondition: MedicalCondition }> => {
    const response = await api.post('/users/medical-conditions', conditionData);
    return response.data;
  },

  // Hastalık çıkarma
  removeMedicalCondition: async (conditionId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/medical-conditions/${conditionId}`);
    return response.data;
  },

  // Admin: Kullanıcı oluşturma (register endpoint kullan)
  createUser: async (userData: any): Promise<{ message: string; user: User }> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Admin: Kullanıcı güncelleme
  updateUser: async (userId: string, userData: any): Promise<{ message: string; user: User }> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Admin: Kullanıcı silme
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};
