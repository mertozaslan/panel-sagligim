'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/users/UserTable';
import { useUsersStore } from '@/stores/usersStore';
import { Search, Filter, Download, AlertCircle } from 'lucide-react';
import { User } from '@/services/users';

export default function UsersPage() {
  const {
    users,
    pagination,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    roleFilter,
    doctorApprovalFilter,
    getAllUsers,
    searchUsers,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setDoctorApprovalFilter,
    clearError,
  } = useUsersStore();

  const [currentPage, setCurrentPage] = useState(1);

  // Sayfa yüklendiğinde kullanıcıları getir
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: 10,
      role: roleFilter !== 'all' ? roleFilter as 'patient' | 'doctor' | 'admin' | 'user' : undefined,
      isActive: statusFilter === 'active' ? true : statusFilter === 'blocked' ? false : undefined,
      doctorApprovalStatus: doctorApprovalFilter !== 'all' ? doctorApprovalFilter as 'pending' | 'rejected' | 'approved' : undefined,
      search: searchTerm || undefined,
    };
    
    getAllUsers(queryParams);
  }, [currentPage, roleFilter, statusFilter, doctorApprovalFilter, searchTerm, getAllUsers]);

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

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleDoctorApprovalFilter = (status: string) => {
    setDoctorApprovalFilter(status);
    setCurrentPage(1);
  };

  // API'den gelen veriler zaten filtrelenmiş olduğu için direkt kullan
  const filteredUsers = users;

  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // TODO: Implement user detail modal or navigation
  };


  // Sayfalama
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout 
      title="Kullanıcılar"
      subtitle="Platform kullanıcılarını ve doktorları yönetin ve izleyin"
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

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
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
                  <option value="active">Aktif</option>
                  <option value="blocked">Engelli</option>
                </select>
              </div>

              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Roller</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doktor</option>
                  <option value="patient">Kullanıcı</option>
                </select>
              </div>

              {/* Doctor Approval Filter */}
              {roleFilter === 'doctor' && (
                <div className="relative">
                  <select
                    value={doctorApprovalFilter}
                    onChange={(e) => handleDoctorApprovalFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Onay Durumları</option>
                    <option value="pending">Beklemede</option>
                    <option value="approved">Onaylanmış</option>
                    <option value="rejected">Reddedilmiş</option>
                  </select>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {pagination?.totalUsers || users.length}
            </div>
            <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => !u.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Engelli Kullanıcı</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Kullanıcılar yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <UserTable
              users={filteredUsers}
              onViewUser={handleViewUser}
            />

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
                      <span className="font-medium">{filteredUsers.length}</span> kullanıcı gösteriliyor
                      {pagination.totalUsers && (
                        <span> (toplam {pagination.totalUsers})</span>
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
      </div>
    </DashboardLayout>
  );
}
