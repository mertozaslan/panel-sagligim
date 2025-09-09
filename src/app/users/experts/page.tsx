'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Expert } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Calendar, 
  CheckCircle,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';

// Mock data
const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Mehmet Yılmaz',
    email: 'dr.mehmet@email.com',
    role: 'expert',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    lastLoginAt: new Date('2024-01-20'),
    specializations: [
      { id: '1', name: 'Beslenme ve Diyet', category: 'nutrition' },
      { id: '2', name: 'Spor Hekimliği', category: 'fitness' }
    ],
    certifications: [
      { id: '1', title: 'Beslenme Uzmanı Sertifikası', institution: 'İstanbul Üniversitesi', year: 2018, verified: true },
      { id: '2', title: 'Spor Hekimliği Diploması', institution: 'Hacettepe Üniversitesi', year: 2015, verified: true }
    ],
    experience: 8,
    rating: 4.8,
    totalConsultations: 245,
    verificationStatus: 'verified',
    verificationDocuments: []
  },
  {
    id: '2',
    name: 'Dr. Ayşe Kaya',
    email: 'dr.ayse@email.com',
    role: 'expert',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    lastLoginAt: new Date('2024-01-19'),
    specializations: [
      { id: '3', name: 'Psikoloji', category: 'mental-health' },
      { id: '4', name: 'Aile Danışmanlığı', category: 'mental-health' }
    ],
    certifications: [
      { id: '3', title: 'Klinik Psikolog', institution: 'Ankara Üniversitesi', year: 2016, verified: true }
    ],
    experience: 6,
    rating: 4.9,
    totalConsultations: 189,
    verificationStatus: 'verified',
    verificationDocuments: []
  },
  {
    id: '3',
    name: 'Dr. Can Özkan',
    email: 'dr.can@email.com',
    role: 'expert',
    status: 'active',
    createdAt: new Date('2024-01-12'),
    lastLoginAt: new Date('2024-01-18'),
    specializations: [
      { id: '5', name: 'Kardiyoloji', category: 'cardiology' }
    ],
    certifications: [
      { id: '4', title: 'Kardiyoloji Uzmanı', institution: 'Ege Üniversitesi', year: 2019, verified: true }
    ],
    experience: 5,
    rating: 4.7,
    totalConsultations: 156,
    verificationStatus: 'verified',
    verificationDocuments: []
  }
];

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>(mockExperts);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specializations.some(s => 
                           s.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSpecialization = specializationFilter === 'all' || 
                                 expert.specializations.some(s => s.category === specializationFilter);
    
    return matchesSearch && matchesSpecialization;
  });

  const handleViewExpert = (expert: Expert) => {
    console.log('View expert:', expert);
    // TODO: Implement expert detail modal or navigation
  };

  const getVerificationBadge = (status: Expert['verificationStatus']) => {
    const statusClasses = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusText = {
      verified: 'Doğrulanmış',
      pending: 'Beklemede',
      rejected: 'Reddedildi'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status]
      )}>
        {status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
        {statusText[status]}
      </span>
    );
  };

  return (
    <DashboardLayout 
      title="Uzmanlar"
      subtitle="Doğrulanmış sağlık uzmanlarını yönetin"
    >
      <div className="space-y-6">
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
                  placeholder="Uzman ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                />
              </div>

              {/* Specialization Filter */}
              <div className="relative">
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Uzmanlık Alanları</option>
                  <option value="nutrition">Beslenme</option>
                  <option value="fitness">Fitness</option>
                  <option value="mental-health">Ruh Sağlığı</option>
                  <option value="cardiology">Kardiyoloji</option>
                  <option value="dermatology">Dermatoloji</option>
                  <option value="pediatrics">Pediatri</option>
                  <option value="general-medicine">Genel Tıp</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-health-500">
                <Filter className="h-4 w-4 mr-2" />
                Gelişmiş Filtre
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-health-500">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{experts.length}</div>
            <div className="text-sm text-gray-600">Toplam Uzman</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {experts.filter(e => e.verificationStatus === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Doğrulanmış</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {experts.reduce((sum, e) => sum + e.totalConsultations, 0)}
            </div>
            <div className="text-sm text-gray-600">Toplam Konsültasyon</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {(experts.reduce((sum, e) => sum + e.rating, 0) / experts.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Ortalama Puan</div>
          </div>
        </div>

        {/* Experts Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uzman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uzmanlık Alanları
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deneyim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puan & Konsültasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExperts.map((expert) => (
                  <tr key={expert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-health-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-health-600">
                              {expert.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{expert.name}</div>
                          <div className="text-sm text-gray-500">{expert.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {expert.specializations.map((spec) => (
                          <span
                            key={spec.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {spec.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {expert.experience} yıl
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{expert.rating}</span>
                          <span className="text-gray-500 ml-1">({expert.totalConsultations})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVerificationBadge(expert.verificationStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewExpert(expert)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">Henüz uzman bulunmuyor</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
