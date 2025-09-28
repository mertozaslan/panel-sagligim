'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorsStore } from '@/stores/doctorsStore';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  User,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';

export default function ExpertApplicationsPage() {
  const {
    pendingDoctors,
    pagination,
    isLoading,
    error,
    searchTerm,
    getPendingDoctors,
    approveDoctor,
    rejectDoctor,
    setSearchTerm,
    clearError,
  } = useDoctorsStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sayfa yüklendiğinde onay bekleyen doktorları getir
  useEffect(() => {
    getPendingDoctors(currentPage, 10);
  }, [currentPage, getPendingDoctors]);

  // Filtrelenmiş doktorlar (client-side arama)
  const filteredDoctors = pendingDoctors.filter(doctor => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleApproveDoctor = async (doctor: any) => {
    try {
      await approveDoctor(doctor._id);
      setShowDetailModal(false);
    } catch (error) {
      console.error('Doktor onaylama hatası:', error);
    }
  };

  const handleRejectDoctor = async (doctor: any) => {
    try {
      await rejectDoctor(doctor._id, rejectionReason);
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Doktor reddetme hatası:', error);
    }
  };

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout 
      title="Doktor Başvuruları"
      subtitle="Onay bekleyen doktor başvurularını inceleyin ve değerlendirin"
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

        {/* Alert for pending applications */}
        {pagination && pagination.totalPending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {pagination.totalPending} doktor başvurusu onayınızı bekliyor
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Başvuruları en kısa sürede değerlendirerek süreci hızlandırın.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Doktor ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Doktorlar yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* Doctors Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doktor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uzmanlık
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hastane
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deneyim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Başvuru Tarihi
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {doctor.firstName} {doctor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">@{doctor.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {doctor.doctorInfo.specialization || 'Belirtilmemiş'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {doctor.doctorInfo.hospital || 'Belirtilmemiş'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {doctor.doctorInfo.experience ? `${doctor.doctorInfo.experience} yıl` : 'Belirtilmemiş'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDistanceToNow(new Date(doctor.createdAt), { addSuffix: true, locale: tr })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDoctor(doctor)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Detayları Görüntüle"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleApproveDoctor(doctor)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Onayla"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reddet"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredDoctors.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">Onay bekleyen doktor başvurusu bulunmuyor</div>
                </div>
              )}
            </div>

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
                      <span className="font-medium">{filteredDoctors.length}</span> doktor gösteriliyor
                      {pagination.totalPending && (
                        <span> (toplam {pagination.totalPending})</span>
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

        {/* Detail Modal */}
        {showDetailModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Doktor Başvuru Detayları
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Bilgiler</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-posta</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                      <p className="text-sm text-gray-900">@{selectedDoctor.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Başvuru Tarihi</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedDoctor.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Doktor Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Uzmanlık Alanı</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.doctorInfo.specialization || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hastane</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.doctorInfo.hospital || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deneyim</label>
                      <p className="text-sm text-gray-900">
                        {selectedDoctor.doctorInfo.experience ? `${selectedDoctor.doctorInfo.experience} yıl` : 'Belirtilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Konum</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.doctorInfo.location || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedDoctor(selectedDoctor);
                      setShowRejectModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reddet
                  </button>
                  <button
                    onClick={() => handleApproveDoctor(selectedDoctor)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Doktoru Reddet
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Red Sebebi (İsteğe bağlı)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Red sebebini açıklayın..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {rejectionReason.length}/500 karakter
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleRejectDoctor(selectedDoctor)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

