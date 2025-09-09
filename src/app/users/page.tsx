'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/users/UserTable';
import { User } from '@/types';
import { Search, Filter, Download } from 'lucide-react';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ayşe Kaya',
    email: 'ayse.kaya@email.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Mehmet Yılmaz',
    email: 'mehmet.yilmaz@email.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    lastLoginAt: new Date('2024-01-19'),
  },
  {
    id: '3',
    name: 'Fatma Öz',
    email: 'fatma.oz@email.com',
    role: 'user',
    status: 'blocked',
    createdAt: new Date('2024-01-05'),
    lastLoginAt: new Date('2024-01-18'),
  },
  {
    id: '4',
    name: 'Can Demir',
    email: 'can.demir@email.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    name: 'Zeynep Ak',
    email: 'zeynep.ak@email.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2024-01-18'),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // TODO: Implement user detail modal or navigation
  };

  const handleToggleUserStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
        : u
    ));
  };

  return (
    <DashboardLayout 
      title="Normal Kullanıcılar"
      subtitle="Platform kullanıcılarını yönetin ve izleyin"
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
                  placeholder="Kullanıcı ara..."
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
                  <option value="active">Aktif</option>
                  <option value="blocked">Engelli</option>
                  <option value="pending">Beklemede</option>
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
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'blocked').length}
            </div>
            <div className="text-sm text-gray-600">Engelli Kullanıcı</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Bekleyen Kullanıcı</div>
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onViewUser={handleViewUser}
          onToggleUserStatus={handleToggleUserStatus}
        />

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Önceki
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sonraki
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{filteredUsers.length}</span> kullanıcı gösteriliyor
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Önceki
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Sonraki
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
