'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/users/UserTable';
import { useUsersStore } from '@/stores/usersStore';
import { Search, Filter, Download, AlertCircle, Plus } from 'lucide-react';
import { User } from '@/services/users';
import { useErrorHandler } from '@/components/common/ErrorHandler';
import { FormField } from '@/components/common/FormField';
import { ImageUpload } from '@/components/common/ImageUpload';
import { validateUserForm, UserFormData } from '@/utils/validation';

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
    createUser,
    updateUser,
    deleteUser,
  } = useUsersStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin',
    profilePicture: '',
    bio: '',
    dateOfBirth: '',
    // Doktor bilgileri
    doctorInfo: {
      location: '',
      specialization: '',
      hospital: '',
      experience: 0,
      licenseNumber: ''
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { handleError, handleSuccess } = useErrorHandler();

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

  const handleCreateUser = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'patient',
      profilePicture: '',
      bio: '',
      dateOfBirth: '',
      doctorInfo: {
        location: '',
        specialization: '',
        hospital: '',
        experience: 0,
        licenseNumber: ''
      }
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    
    // Format date for input
    let dateOfBirthFormatted = '';
    if (user.dateOfBirth) {
      const date = new Date(user.dateOfBirth);
      dateOfBirthFormatted = date.toISOString().split('T')[0];
    }
    
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as 'patient' | 'doctor' | 'admin',
      profilePicture: user.profilePicture || '',
      bio: user.bio || '',
      dateOfBirth: dateOfBirthFormatted,
      doctorInfo: {
        location: user.doctorInfo?.location || '',
        specialization: user.doctorInfo?.specialization || '',
        hospital: user.doctorInfo?.hospital || '',
        experience: user.doctorInfo?.experience || 0,
        licenseNumber: user.doctorInfo?.licenseNumber || ''
      }
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`${user.firstName} ${user.lastName} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      const userId = user.id || (user as any)._id;
      if (!userId) {
        handleError('Kullanıcı ID bulunamadı');
        return;
      }
      
      try {
        await deleteUser(userId);
        handleSuccess('Kullanıcı başarıyla silindi');
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Doktor bilgileri için
    if (name.startsWith('doctorInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          [field]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate form
    const validationErrors = validateUserForm(formData as UserFormData, false);
    if (validationErrors.length > 0) {
      const errors: Record<string, string> = {};
      validationErrors.forEach(error => {
        errors[error.field] = error.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      const userData: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        profilePicture: formData.profilePicture || undefined,
        bio: formData.bio || undefined,
        dateOfBirth: formData.dateOfBirth || undefined
      };

      // Eğer doktor ise doctorInfo ekle
      if (formData.role === 'doctor') {
        userData.doctorInfo = {
          location: formData.doctorInfo.location || undefined,
          specialization: formData.doctorInfo.specialization || undefined,
          hospital: formData.doctorInfo.hospital || undefined,
          experience: formData.doctorInfo.experience || undefined,
          licenseNumber: formData.doctorInfo.licenseNumber || undefined
        };
      }

      await createUser(userData);
      handleSuccess('Kullanıcı başarıyla oluşturuldu');
      handleCloseModals();
      getAllUsers();
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const userId = editingUser.id || (editingUser as any)._id;
    if (!userId) {
      handleError('Kullanıcı ID bulunamadı');
      return;
    }

    setFormErrors({});

    // Validate form (edit mode - password not required)
    const validationErrors = validateUserForm(formData as UserFormData, true);
    if (validationErrors.length > 0) {
      const errors: Record<string, string> = {};
      validationErrors.forEach(error => {
        errors[error.field] = error.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        dateOfBirth: formData.dateOfBirth || undefined
      };

      // Eğer doktor ise doctorInfo ekle
      if (formData.role === 'doctor') {
        updateData.doctorInfo = {
          location: formData.doctorInfo.location || undefined,
          specialization: formData.doctorInfo.specialization || undefined,
          hospital: formData.doctorInfo.hospital || undefined,
          experience: formData.doctorInfo.experience || undefined,
          licenseNumber: formData.doctorInfo.licenseNumber || undefined
        };
      }

      await updateUser(userId, updateData);
      handleSuccess('Kullanıcı başarıyla güncellendi');
      handleCloseModals();
      getAllUsers();
    } catch (error) {
      handleError(error);
    }
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

        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div></div>
          <button 
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-health-600 hover:bg-health-700 focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kullanıcı
          </button>
        </div>

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
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
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

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Yeni Kullanıcı Oluştur
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Kullanıcı Adı"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        error={formErrors.username}
                        placeholder="kullanici_adi"
                      />
                      
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        error={formErrors.email}
                        placeholder="email@example.com"
                      />
                    </div>

                    <FormField
                      label="Şifre"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      error={formErrors.password}
                      placeholder="En az 6 karakter"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Ad"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        error={formErrors.firstName}
                        placeholder="Ad"
                      />
                      
                      <FormField
                        label="Soyad"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        error={formErrors.lastName}
                        placeholder="Soyad"
                      />
                    </div>

                    <FormField
                      label="Rol"
                      name="role"
                      type="select"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      error={formErrors.role}
                      options={[
                        { value: 'patient', label: 'Kullanıcı' },
                        { value: 'doctor', label: 'Doktor' },
                        { value: 'admin', label: 'Admin' }
                      ]}
                    />

                    <FormField
                      label="Biyografi"
                      name="bio"
                      type="textarea"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      error={formErrors.bio}
                      placeholder="Kısa biyografi..."
                    />

                    <FormField
                      label="Doğum Tarihi"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      error={formErrors.dateOfBirth}
                    />

                    <ImageUpload
                      label="Profil Resmi"
                      value={formData.profilePicture}
                      onChange={(imageUrl) => setFormData(prev => ({ ...prev, profilePicture: imageUrl }))}
                      error={formErrors.profilePicture}
                    />

                    {/* Doktor Bilgileri - Sadece doktor rolü seçildiğinde göster */}
                    {formData.role === 'doctor' && (
                      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-900">Doktor Bilgileri</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Uzmanlık Alanı"
                            name="doctorInfo.specialization"
                            type="text"
                            value={formData.doctorInfo.specialization}
                            onChange={handleInputChange}
                            placeholder="Örn: Beslenme ve Diyet"
                            error={formErrors['doctorInfo.specialization']}
                          />
                          
                          <FormField
                            label="Lisans Numarası"
                            name="doctorInfo.licenseNumber"
                            type="text"
                            value={formData.doctorInfo.licenseNumber}
                            onChange={handleInputChange}
                            placeholder="Diploma/Lisans numarası"
                            error={formErrors['doctorInfo.licenseNumber']}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Hastane/Klinik"
                            name="doctorInfo.hospital"
                            type="text"
                            value={formData.doctorInfo.hospital}
                            onChange={handleInputChange}
                            placeholder="Çalıştığı hastane"
                            error={formErrors['doctorInfo.hospital']}
                          />
                          
                          <FormField
                            label="Lokasyon"
                            name="doctorInfo.location"
                            type="text"
                            value={formData.doctorInfo.location}
                            onChange={handleInputChange}
                            placeholder="Şehir"
                            error={formErrors['doctorInfo.location']}
                          />
                        </div>

                        <FormField
                          label="Deneyim (Yıl)"
                          name="doctorInfo.experience"
                          type="number"
                          value={formData.doctorInfo.experience}
                          onChange={handleInputChange}
                          min={0}
                          max={50}
                          placeholder="Deneyim yılı"
                          error={formErrors['doctorInfo.experience']}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseModals}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-health-600 text-white rounded-md hover:bg-health-700"
                      >
                        Kullanıcı Oluştur
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Kullanıcı Düzenle
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6">
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Ad"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        error={formErrors.firstName}
                      />
                      
                      <FormField
                        label="Soyad"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        error={formErrors.lastName}
                      />
                    </div>

                    <FormField
                      label="Biyografi"
                      name="bio"
                      type="textarea"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      error={formErrors.bio}
                      placeholder="Kısa biyografi..."
                    />

                    <FormField
                      label="Doğum Tarihi"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      error={formErrors.dateOfBirth}
                    />

                    <ImageUpload
                      label="Profil Resmi"
                      value={formData.profilePicture}
                      onChange={(imageUrl) => setFormData(prev => ({ ...prev, profilePicture: imageUrl }))}
                      error={formErrors.profilePicture}
                    />

                    {/* Doktor Bilgileri - Sadece doktor rolü ise göster */}
                    {formData.role === 'doctor' && (
                      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-900">Doktor Bilgileri</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Uzmanlık Alanı"
                            name="doctorInfo.specialization"
                            type="text"
                            value={formData.doctorInfo.specialization}
                            onChange={handleInputChange}
                            placeholder="Örn: Beslenme ve Diyet"
                            error={formErrors['doctorInfo.specialization']}
                          />
                          
                          <FormField
                            label="Lisans Numarası"
                            name="doctorInfo.licenseNumber"
                            type="text"
                            value={formData.doctorInfo.licenseNumber}
                            onChange={handleInputChange}
                            placeholder="Diploma/Lisans numarası"
                            error={formErrors['doctorInfo.licenseNumber']}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            label="Hastane/Klinik"
                            name="doctorInfo.hospital"
                            type="text"
                            value={formData.doctorInfo.hospital}
                            onChange={handleInputChange}
                            placeholder="Çalıştığı hastane"
                            error={formErrors['doctorInfo.hospital']}
                          />
                          
                          <FormField
                            label="Lokasyon"
                            name="doctorInfo.location"
                            type="text"
                            value={formData.doctorInfo.location}
                            onChange={handleInputChange}
                            placeholder="Şehir"
                            error={formErrors['doctorInfo.location']}
                          />
                        </div>

                        <FormField
                          label="Deneyim (Yıl)"
                          name="doctorInfo.experience"
                          type="number"
                          value={formData.doctorInfo.experience}
                          onChange={handleInputChange}
                          min={0}
                          max={50}
                          placeholder="Deneyim yılı"
                          error={formErrors['doctorInfo.experience']}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseModals}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-health-600 text-white rounded-md hover:bg-health-700"
                      >
                        Değişiklikleri Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
