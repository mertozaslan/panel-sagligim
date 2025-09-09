'use client';

import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  MoreHorizontal, 
  Eye, 
  Shield, 
  ShieldOff, 
  Mail,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
}

export default function UserTable({ users, onViewUser, onToggleUserStatus }: UserTableProps) {
  const getStatusBadge = (status: User['status']) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const statusText = {
      active: 'Aktif',
      blocked: 'Engelli',
      pending: 'Beklemede'
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

  const getRoleBadge = (role: User['role']) => {
    const roleClasses = {
      user: 'bg-blue-100 text-blue-800',
      expert: 'bg-purple-100 text-purple-800',
      admin: 'bg-gray-100 text-gray-800'
    };

    const roleText = {
      user: 'Kullanıcı',
      expert: 'Uzman',
      admin: 'Admin'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        roleClasses[role]
      )}>
        {roleText[role]}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Giriş
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.avatar ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {formatDistanceToNow(user.createdAt, { addSuffix: true, locale: tr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastLoginAt ? (
                    formatDistanceToNow(user.lastLoginAt, { addSuffix: true, locale: tr })
                  ) : (
                    <span className="text-gray-400">Hiç giriş yapmamış</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onToggleUserStatus(user)}
                      className={clsx(
                        'p-1',
                        user.status === 'active' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      )}
                      title={user.status === 'active' ? 'Engelle' : 'Aktif Yap'}
                    >
                      {user.status === 'active' ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
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

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Henüz kullanıcı bulunmuyor</div>
        </div>
      )}
    </div>
  );
}
