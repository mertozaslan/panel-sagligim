'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Expert, Document } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';

// Mock data for expert applications
const mockApplications: Expert[] = [
  {
    id: '1',
    name: 'Dr. Fatma Özkan',
    email: 'dr.fatma@email.com',
    role: 'expert',
    status: 'pending',
    createdAt: new Date('2024-01-18'),
    specializations: [
      { id: '1', name: 'Dermatoloji', category: 'dermatology' }
    ],
    certifications: [
      { id: '1', title: 'Dermatoloji Uzmanı', institution: 'İstanbul Üniversitesi', year: 2020, verified: false }
    ],
    experience: 4,
    rating: 0,
    totalConsultations: 0,
    verificationStatus: 'pending',
    verificationDocuments: [
      { id: '1', name: 'diploma.pdf', url: '/docs/diploma.pdf', type: 'diploma', uploadedAt: new Date('2024-01-18'), verified: false },
      { id: '2', name: 'certificate.pdf', url: '/docs/certificate.pdf', type: 'certificate', uploadedAt: new Date('2024-01-18'), verified: false }
    ]
  },
  {
    id: '2',
    name: 'Dr. Okan Yılmaz',
    email: 'dr.okan@email.com',
    role: 'expert',
    status: 'pending',
    createdAt: new Date('2024-01-17'),
    specializations: [
      { id: '2', name: 'Pediatri', category: 'pediatrics' }
    ],
    certifications: [
      { id: '2', title: 'Çocuk Doktoru', institution: 'Hacettepe Üniversitesi', year: 2018, verified: false }
    ],
    experience: 6,
    rating: 0,
    totalConsultations: 0,
    verificationStatus: 'pending',
    verificationDocuments: [
      { id: '3', name: 'medical_license.pdf', url: '/docs/medical_license.pdf', type: 'license', uploadedAt: new Date('2024-01-17'), verified: false },
      { id: '4', name: 'specialization.pdf', url: '/docs/specialization.pdf', type: 'certificate', uploadedAt: new Date('2024-01-17'), verified: false }
    ]
  },
  {
    id: '3',
    name: 'Dr. Elif Kaya',
    email: 'dr.elif@email.com',
    role: 'expert',
    status: 'pending',
    createdAt: new Date('2024-01-16'),
    specializations: [
      { id: '3', name: 'Beslenme ve Diyet', category: 'nutrition' }
    ],
    certifications: [
      { id: '3', title: 'Diyetisyen', institution: 'Başkent Üniversitesi', year: 2019, verified: false }
    ],
    experience: 5,
    rating: 0,
    totalConsultations: 0,
    verificationStatus: 'pending',
    verificationDocuments: [
      { id: '5', name: 'dietitian_cert.pdf', url: '/docs/dietitian_cert.pdf', type: 'certificate', uploadedAt: new Date('2024-01-16'), verified: false }
    ]
  }
];

export default function ExpertApplicationsPage() {
  const [applications, setApplications] = useState<Expert[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Expert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.specializations.some(s => 
                           s.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    return matchesSearch;
  });

  const handleApproveApplication = (application: Expert) => {
    setApplications(applications.filter(app => app.id !== application.id));
    // TODO: Send approval API call
    console.log('Approved:', application);
  };

  const handleRejectApplication = (application: Expert) => {
    setApplications(applications.filter(app => app.id !== application.id));
    // TODO: Send rejection API call
    console.log('Rejected:', application);
  };

  const handleViewApplication = (application: Expert) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const getDocumentIcon = (type: Document['type']) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <DashboardLayout 
      title="Uzman Başvuruları"
      subtitle="Onay bekleyen uzman başvurularını inceleyin ve değerlendirin"
    >
      <div className="space-y-6">
        {/* Alert for pending applications */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {applications.length} uzman başvurusu onayınızı bekliyor
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Başvuruları en kısa sürede değerlendirerek süreci hızlandırın.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Başvuru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başvuran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uzmanlık Alanı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deneyim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belgeler
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
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {application.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {application.specializations.map((spec) => (
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
                        {application.experience} yıl
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {application.verificationDocuments.map((doc) => (
                          <span
                            key={doc.id}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            title={doc.name}
                          >
                            {getDocumentIcon(doc.type)}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500">
                          {application.verificationDocuments.length} belge
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDistanceToNow(application.createdAt, { addSuffix: true, locale: tr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleApproveApplication(application)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Onayla"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleRejectApplication(application)}
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

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">Onay bekleyen uzman başvurusu bulunmuyor</div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Uzman Başvuru Detayları
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
                      <p className="text-sm text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-posta</label>
                      <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deneyim</label>
                      <p className="text-sm text-gray-900">{selectedApplication.experience} yıl</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Başvuru Tarihi</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.createdAt.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uzmanlık Alanları</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.specializations.map((spec) => (
                      <span
                        key={spec.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sertifikalar</h3>
                  <div className="space-y-3">
                    {selectedApplication.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{cert.title}</h4>
                            <p className="text-sm text-gray-600">{cert.institution}</p>
                            <p className="text-sm text-gray-500">{cert.year}</p>
                          </div>
                          <span className={clsx(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            cert.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}>
                            {cert.verified ? 'Doğrulandı' : 'Beklemede'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Yüklenen Belgeler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.verificationDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getDocumentIcon(doc.type)}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(doc.uploadedAt, { addSuffix: true, locale: tr })}
                              </p>
                            </div>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleRejectApplication(selectedApplication);
                      setShowDetailModal(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reddet
                  </button>
                  <button
                    onClick={() => {
                      handleApproveApplication(selectedApplication);
                      setShowDetailModal(false);
                    }}
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
      </div>
    </DashboardLayout>
  );
}
