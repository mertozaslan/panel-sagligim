'use client';

import { User, Calendar, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface RecentUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  createdAt: string;
  isActive: boolean;
  isVerified: boolean;
}

interface RecentUsersListProps {
  users: RecentUser[];
  loading?: boolean;
}

export default function RecentUsersList({ users, loading = false }: RecentUsersListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">Son Kayıt Olanlar</h3>
        <span className="text-sm text-gray-400">({Math.min(users.length, 5)})</span>
      </div>

      <div className="space-y-2">
        {users.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Henüz veri bulunmuyor
          </div>
        ) : (
          users.slice(0, 5).map((user) => (
            <div
              key={user._id}
              className="flex items-center space-x-3 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
            >
              <div className="flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-health-400 to-health-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.isVerified && (
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    user.role === 'doctor' ? 'bg-blue-50 text-blue-700' :
                    user.role === 'admin' ? 'bg-red-50 text-red-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {user.role === 'doctor' ? 'Doktor' : user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
