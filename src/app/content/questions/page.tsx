'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Question, Expert } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Clock, 
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  UserCheck,
  CheckCircle,
  Eye,
  XCircle
} from 'lucide-react';
import { clsx } from 'clsx';

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'Günlük protein ihtiyacım ne kadar olmalı?',
    content: 'Spor yapan bir kişi olarak günlük protein ihtiyacımı karşılayabilmek için ne kadar protein tüketmeliyim?',
    authorId: '1',
    author: { id: '1', name: 'Ayşe Kaya', email: 'ayse@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'nutrition',
    tags: ['protein', 'spor', 'beslenme'],
    status: 'open',
    priority: 'medium',
    answers: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    deadline: new Date('2024-01-22')
  },
  {
    id: '2',
    title: 'Kalp çarpıntısı normal mi?',
    content: 'Son zamanlarda egzersiz sırasında kalp çarpıntısı yaşıyorum. Bu normal midir?',
    authorId: '2',
    author: { id: '2', name: 'Mehmet Yılmaz', email: 'mehmet@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'fitness',
    tags: ['kalp', 'egzersiz', 'sağlık'],
    status: 'assigned',
    priority: 'high',
    expertId: '1',
    expert: { 
      id: '1', 
      name: 'Dr. Can Özkan', 
      email: 'dr.can@email.com', 
      role: 'expert', 
      status: 'active', 
      createdAt: new Date(),
      specializations: [{ id: '1', name: 'Kardiyoloji', category: 'cardiology' }],
      certifications: [],
      experience: 5,
      rating: 4.7,
      totalConsultations: 156,
      verificationStatus: 'verified',
      verificationDocuments: []
    },
    answers: [],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    deadline: new Date('2024-01-21')
  },
  {
    id: '3',
    title: 'Stresle başa çıkma yöntemleri',
    content: 'İş stresi yüzünden uyku problemleri yaşıyorum. Hangi yöntemleri deneyebilirim?',
    authorId: '3',
    author: { id: '3', name: 'Zeynep Ak', email: 'zeynep@email.com', role: 'user', status: 'active', createdAt: new Date() },
    category: 'mental-health',
    tags: ['stres', 'uyku', 'psikoloji'],
    status: 'answered',
    priority: 'medium',
    expertId: '2',
    expert: { 
      id: '2', 
      name: 'Dr. Ayşe Kaya', 
      email: 'dr.ayse@email.com', 
      role: 'expert', 
      status: 'active', 
      createdAt: new Date(),
      specializations: [{ id: '2', name: 'Psikoloji', category: 'mental-health' }],
      certifications: [],
      experience: 6,
      rating: 4.9,
      totalConsultations: 189,
      verificationStatus: 'verified',
      verificationDocuments: []
    },
    answers: [
      {
        id: '1',
        questionId: '3',
        content: 'Stres yönetimi için düzenli egzersiz, meditasyon ve uyku hijyeni önemlidir...',
        authorId: '2',
        author: { 
          id: '2', 
          name: 'Dr. Ayşe Kaya', 
          email: 'dr.ayse@email.com', 
          role: 'expert', 
          status: 'active', 
          createdAt: new Date(),
          specializations: [],
          certifications: [],
          experience: 6,
          rating: 4.9,
          totalConsultations: 189,
          verificationStatus: 'verified',
          verificationDocuments: []
        },
        status: 'published',
        helpful: 5,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      }
    ],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18')
  }
];

const mockExperts: Expert[] = [
  { 
    id: '1', 
    name: 'Dr. Can Özkan', 
    email: 'dr.can@email.com', 
    role: 'expert', 
    status: 'active', 
    createdAt: new Date(),
    specializations: [{ id: '1', name: 'Kardiyoloji', category: 'cardiology' }],
    certifications: [],
    experience: 5,
    rating: 4.7,
    totalConsultations: 156,
    verificationStatus: 'verified',
    verificationDocuments: []
  },
  { 
    id: '2', 
    name: 'Dr. Ayşe Kaya', 
    email: 'dr.ayse@email.com', 
    role: 'expert', 
    status: 'active', 
    createdAt: new Date(),
    specializations: [{ id: '2', name: 'Psikoloji', category: 'mental-health' }],
    certifications: [],
    experience: 6,
    rating: 4.9,
    totalConsultations: 189,
    verificationStatus: 'verified',
    verificationDocuments: []
  },
  { 
    id: '3', 
    name: 'Dr. Mehmet Yılmaz', 
    email: 'dr.mehmet@email.com', 
    role: 'expert', 
    status: 'active', 
    createdAt: new Date(),
    specializations: [{ id: '3', name: 'Beslenme ve Diyet', category: 'nutrition' }],
    certifications: [],
    experience: 8,
    rating: 4.8,
    totalConsultations: 245,
    verificationStatus: 'verified',
    verificationDocuments: []
  }
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [experts] = useState<Expert[]>(mockExperts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || question.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignExpert = (question: Question, expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
      setQuestions(questions.map(q => 
        q.id === question.id 
          ? { ...q, status: 'assigned', expertId, expert }
          : q
      ));
    }
    setShowAssignModal(false);
  };

  const handleView = (question: Question) => {
    setSelectedQuestion(question);
    setShowDetailModal(true);
  };

  const handleAssign = (question: Question) => {
    setSelectedQuestion(question);
    setShowAssignModal(true);
  };

  const getStatusBadge = (status: Question['status']) => {
    const statusClasses = {
      open: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      answered: 'bg-green-100 text-green-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    const statusText = {
      open: 'Açık',
      assigned: 'Atanmış',
      answered: 'Cevaplandı',
      resolved: 'Çözüldü',
      closed: 'Kapalı'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status]
      )}>
        {statusText[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: Question['priority']) => {
    const priorityClasses = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    const priorityText = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      urgent: 'Acil'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        priorityClasses[priority]
      )}>
        {priorityText[priority]}
      </span>
    );
  };

  const isOverdue = (question: Question) => {
    return question.deadline && new Date() > question.deadline && question.status !== 'answered' && question.status !== 'resolved';
  };

  const openCount = questions.filter(q => q.status === 'open').length;
  const assignedCount = questions.filter(q => q.status === 'assigned').length;
  const answeredCount = questions.filter(q => q.status === 'answered').length;
  const overdueCount = questions.filter(q => isOverdue(q)).length;

  return (
    <DashboardLayout 
      title="Sorular"
      subtitle="Kullanıcı sorularını yönetin ve uzman ataması yapın"
    >
      <div className="space-y-6">
        {/* Alert for overdue questions */}
        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {overdueCount} soru süresi geçmiş
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Bu soruları öncelikle uzmanla eşleştirin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Soru ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="open">Açık</option>
                  <option value="assigned">Atanmış</option>
                  <option value="answered">Cevaplandı</option>
                  <option value="resolved">Çözüldü</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
                >
                  <option value="all">Tüm Öncelikler</option>
                  <option value="urgent">Acil</option>
                  <option value="high">Yüksek</option>
                  <option value="medium">Orta</option>
                  <option value="low">Düşük</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Gelişmiş Filtre
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{openCount}</div>
            <div className="text-sm text-gray-600">Açık Sorular</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
            <div className="text-sm text-gray-600">Atanmış</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
            <div className="text-sm text-gray-600">Cevaplandı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <div className="text-sm text-gray-600">Süresi Geçmiş</div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Soru
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Soran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atanan Uzman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <tr key={question.id} className={clsx(
                    'hover:bg-gray-50',
                    isOverdue(question) && 'bg-red-50'
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {question.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {question.content.length > 100 
                              ? question.content.slice(0, 100) + '...' 
                              : question.content}
                          </p>
                          {isOverdue(question) && (
                            <div className="flex items-center mt-2 text-xs text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Süre geçmiş
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {question.author.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {question.expert ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-health-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-health-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {question.expert.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Atanmamış</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(question.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(question.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDistanceToNow(question.createdAt, { addSuffix: true, locale: tr })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(question)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {question.status === 'open' && (
                          <button
                            onClick={() => handleAssign(question)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Uzman Ata"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">Soru bulunmuyor</div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Soru Detayları
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedQuestion.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>Soran: {selectedQuestion.author.name}</span>
                    <span>Kategori: {selectedQuestion.category}</span>
                    <span>Tarih: {selectedQuestion.createdAt.toLocaleDateString('tr-TR')}</span>
                    {selectedQuestion.deadline && (
                      <span className={clsx(
                        isOverdue(selectedQuestion) ? 'text-red-600' : 'text-gray-600'
                      )}>
                        Son Tarih: {selectedQuestion.deadline.toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.content}</p>
                  </div>
                </div>

                {selectedQuestion.answers.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Cevaplar</h4>
                    <div className="space-y-4">
                      {selectedQuestion.answers.map((answer) => (
                        <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-health-100 rounded-full flex items-center justify-center mr-3">
                                <UserCheck className="h-4 w-4 text-health-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{answer.author.name}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDistanceToNow(answer.createdAt, { addSuffix: true, locale: tr })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{answer.helpful} faydalı</span>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assign Expert Modal */}
        {showAssignModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Uzman Ata
                  </h2>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedQuestion.title}</h3>
                  <p className="text-sm text-gray-600">Bu soruyu yanıtlayacak uzmanı seçin:</p>
                </div>

                <div className="space-y-3">
                  {experts.map((expert) => (
                    <div key={expert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-health-100 rounded-full flex items-center justify-center mr-3">
                            <UserCheck className="h-5 w-5 text-health-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{expert.name}</div>
                            <div className="text-sm text-gray-600">
                              {expert.specializations.map(s => s.name).join(', ')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {expert.experience} yıl deneyim • {expert.totalConsultations} konsültasyon
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignExpert(selectedQuestion, expert.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-health-600 hover:bg-health-700"
                        >
                          Ata
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
