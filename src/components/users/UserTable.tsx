'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  MoreHorizontal, 
  Eye, 
  Calendar,
  X,
  Mail,
  User as UserIcon,
  MapPin,
  Building,
  Award,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { User } from '@/services/users';

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export default function UserTable({ users, onViewUser, onEditUser, onDeleteUser }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const getStatusBadge = (isActive: boolean) => {
    const statusClasses = {
      true: 'bg-green-100 text-green-800',
      false: 'bg-red-100 text-red-800'
    };

    const statusText = {
      true: 'Aktif',
      false: 'Engelli'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[isActive.toString() as keyof typeof statusClasses]
      )}>
        {statusText[isActive.toString() as keyof typeof statusText]}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      patient: 'bg-blue-100 text-blue-800',
      doctor: 'bg-purple-100 text-purple-800',
      admin: 'bg-gray-100 text-gray-800'
    };

    const roleText = {
      patient: 'Kullanıcı',
      doctor: 'Doktor',
      admin: 'Admin'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        roleClasses[role as keyof typeof roleClasses] || 'bg-gray-100 text-gray-800'
      )}>
        {roleText[role as keyof typeof roleText] || role}
      </span>
    );
  };

  const getDoctorApprovalBadge = (approvalStatus: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusText = {
      pending: 'Beklemede',
      approved: 'Onaylanmış',
      rejected: 'Reddedilmiş'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[approvalStatus as keyof typeof statusClasses]
      )}>
        {statusText[approvalStatus as keyof typeof statusText]}
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
                Onay Durumu
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
                      {user.profilePicture ? (
                        <Image 
                          className="rounded-full object-cover" 
                          src={
                            user.profilePicture.startsWith('http') 
                              ? user.profilePicture 
                              : `${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:3000'}${user.profilePicture}`
                          } 
                          alt={`${user.firstName} ${user.lastName}`}
                          width={40}
                          height={40}
                          unoptimized
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.isActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === 'doctor' && user.doctorInfo ? (
                    getDoctorApprovalBadge(user.doctorInfo.approvalStatus)
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastLogin ? (
                    formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true, locale: tr })
                  ) : (
                    <span className="text-gray-400">Hiç giriş yapmamış</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDeleteUser(user)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
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

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Kullanıcı Detayları
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-6 space-y-6">
                {/* User Profile Section */}
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    {selectedUser.profilePicture ? (
                      <Image 
                        className="rounded-full object-cover" 
                        src={
                          selectedUser.profilePicture.startsWith('http') 
                            ? selectedUser.profilePicture 
                            : `${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:3000'}${selectedUser.profilePicture}`
                        } 
                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        width={64}
                        height={64}
                        unoptimized
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700">
                          {selectedUser.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.isActive)}
                      {selectedUser.role === 'doctor' && selectedUser.doctorInfo && (
                        getDoctorApprovalBadge(selectedUser.doctorInfo.approvalStatus)
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Temel Bilgiler
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedUser.username}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(selectedUser.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                      {selectedUser.lastLogin && (
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Son giriş: {formatDistanceToNow(new Date(selectedUser.lastLogin), { addSuffix: true, locale: tr })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Information */}
                  {selectedUser.role === 'doctor' && selectedUser.doctorInfo && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                        Doktor Bilgileri
                      </h5>
                      <div className="space-y-3">
                        {selectedUser.doctorInfo.specialization && (
                          <div className="flex items-center space-x-3">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.doctorInfo.specialization}</span>
                          </div>
                        )}
                        {selectedUser.doctorInfo.hospital && (
                          <div className="flex items-center space-x-3">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.doctorInfo.hospital}</span>
                          </div>
                        )}
                        {selectedUser.doctorInfo.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.doctorInfo.location}</span>
                          </div>
                        )}
                        {selectedUser.doctorInfo.experience && (
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.doctorInfo.experience} yıl deneyim</span>
                          </div>
                        )}
                        {selectedUser.doctorInfo.approvalDate && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Onay tarihi: {formatDistanceToNow(new Date(selectedUser.doctorInfo.approvalDate), { addSuffix: true, locale: tr })}
                            </span>
                          </div>
                        )}
                        {selectedUser.doctorInfo.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                              <strong>Red sebebi:</strong> {selectedUser.doctorInfo.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
