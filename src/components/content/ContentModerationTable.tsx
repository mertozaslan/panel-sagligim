'use client';

import { Post, Question, Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Flag,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';

type ContentItem = Post | Question | Comment;

interface ContentModerationTableProps {
  items: ContentItem[];
  onApprove: (item: ContentItem) => void;
  onReject: (item: ContentItem) => void;
  onView: (item: ContentItem) => void;
  onEdit?: (item: ContentItem) => void;
}

export default function ContentModerationTable({ 
  items, 
  onApprove, 
  onReject, 
  onView, 
  onEdit 
}: ContentModerationTableProps) {
  const getContentType = (item: ContentItem): string => {
    if ('excerpt' in item) return 'Makale';
    if ('answers' in item) return 'Soru';
    return 'Yorum';
  };

  const getContentIcon = (item: ContentItem) => {
    if ('excerpt' in item) return <Edit className="h-4 w-4" />;
    if ('answers' in item) return <MessageSquare className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  const getItemTitle = (item: ContentItem): string => {
    if ('title' in item) return item.title;
    if ('content' in item) return item.content.substring(0, 50) + '...';
    return 'Başlık yok';
  };

  const getItemCategory = (item: ContentItem): string => {
    if ('category' in item) return item.category;
    return 'Genel';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800'
    };

    const statusText = {
      pending: 'Bekliyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      published: 'Yayında',
      draft: 'Taslak'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
      )}>
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      nutrition: 'bg-green-100 text-green-800',
      fitness: 'bg-blue-100 text-blue-800',
      'mental-health': 'bg-purple-100 text-purple-800',
      lifestyle: 'bg-pink-100 text-pink-800',
      diseases: 'bg-red-100 text-red-800',
      prevention: 'bg-yellow-100 text-yellow-800',
      wellness: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };

    const categoryText = {
      nutrition: 'Beslenme',
      fitness: 'Fitness',
      'mental-health': 'Ruh Sağlığı',
      lifestyle: 'Yaşam Tarzı',
      diseases: 'Hastalıklar',
      prevention: 'Korunma',
      wellness: 'Sağlık',
      other: 'Diğer'
    };

    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        categoryClasses[category as keyof typeof categoryClasses] || 'bg-gray-100 text-gray-800'
      )}>
        {categoryText[category as keyof typeof categoryText] || category}
      </span>
    );
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İçerik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
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
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getContentIcon(item)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {getContentType(item)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {getItemTitle(item)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {truncateText(item.content)}
                      </p>
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
                        {item.author.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.author.role === 'expert' ? 'Uzman' : 'Kullanıcı'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(getItemCategory(item))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {formatDistanceToNow(item.createdAt, { addSuffix: true, locale: tr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(item)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(item)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Onayla"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onReject(item)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Reddet"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">İncelenecek içerik bulunmuyor</div>
        </div>
      )}
    </div>
  );
}
