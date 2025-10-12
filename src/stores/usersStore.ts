import { create } from 'zustand';
import { usersService, User, UsersResponse, UserStats, UsersQueryParams } from '@/services/users';

interface UsersState {
  // State
  users: User[];
  currentUser: User | null;
  userStats: UserStats | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  doctorApprovalFilter: string;

  // Actions
  getAllUsers: (queryParams?: UsersQueryParams) => Promise<void>;
  searchUsers: (searchTerm: string, page?: number, limit?: number) => Promise<void>;
  getUserById: (userId: string) => Promise<void>;
  getUserStats: (userId: string) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: string) => void;
  setRoleFilter: (role: string) => void;
  setDoctorApprovalFilter: (status: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  resetUsers: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  userStats: null,
  pagination: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  roleFilter: 'all',
  doctorApprovalFilter: 'all',

  // Actions
  getAllUsers: async (queryParams: UsersQueryParams = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response: UsersResponse = await usersService.getAllUsers(queryParams);
      
      set({
        users: response.users,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu',
      });
      throw error;
    }
  },

  searchUsers: async (searchTerm: string, page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      
      const response: UsersResponse = await usersService.searchUsers(searchTerm, page, limit);
      
      set({
        users: response.users,
        pagination: response.pagination,
        searchTerm,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı arama sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.getUserById(userId);
      
      set({
        currentUser: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı detayları alınırken bir hata oluştu',
      });
      throw error;
    }
  },

  getUserStats: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.getUserStats(userId);
      
      set({
        userStats: response.stats,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı istatistikleri alınırken bir hata oluştu',
      });
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.updateProfile(profileData);
      
      set({
        currentUser: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Profil güncellenirken bir hata oluştu',
      });
      throw error;
    }
  },

  toggleFollow: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.toggleFollow(userId);
      
      // Kullanıcı listesini güncelle
      const { users } = get();
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: response.isFollowing, followersCount: response.followersCount }
          : user
      );
      
      set({
        users: updatedUsers,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Takip işlemi sırasında bir hata oluştu',
      });
      throw error;
    }
  },

  createUser: async (userData: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.createUser(userData);
      
      const { users } = get();
      set({
        users: [response.user, ...users],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı oluşturulurken bir hata oluştu',
      });
      throw error;
    }
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersService.updateUser(userId, userData);
      
      const { users } = get();
      const updatedUsers = users.map(user => 
        user.id === userId ? response.user : user
      );
      
      set({
        users: updatedUsers,
        currentUser: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu',
      });
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await usersService.deleteUser(userId);
      
      const { users } = get();
      const filteredUsers = users.filter(user => user.id !== userId);
      
      set({
        users: filteredUsers,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu',
      });
      throw error;
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setStatusFilter: (filter: string) => {
    set({ statusFilter: filter });
  },

  setRoleFilter: (role: string) => {
    set({ roleFilter: role });
  },

  setDoctorApprovalFilter: (status: string) => {
    set({ doctorApprovalFilter: status });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  resetUsers: () => {
    set({
      users: [],
      currentUser: null,
      userStats: null,
      pagination: null,
      searchTerm: '',
      statusFilter: 'all',
      roleFilter: 'all',
      doctorApprovalFilter: 'all',
      error: null,
    });
  },
}));
