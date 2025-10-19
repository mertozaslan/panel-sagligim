'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Heart, 
  MessageSquare, 
  AlertTriangle,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface CommentsTableProps {
  comments: Comment[];
  loading?: boolean;
  onView?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
  onLike?: (comment: Comment) => void;
  onDislike?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
}

export default function CommentsTable({
  comments,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  onReport,
}: CommentsTableProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const getAuthorName = (comment: Comment) => {
    if (comment.isAnonymous) {
      return 'Anonim Kullanıcı';
    }
    return `${comment.author.firstName} ${comment.author.lastName} (@${comment.author.username})`;
  };

  const getContentPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz yorum yok</h3>
        <p className="text-gray-600">Bu post için henüz yorum yapılmamış.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yorum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İstatistikler
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => {
              const isExpanded = expandedComments.has(comment.id);
              const isParentComment = !comment.parentComment;
              
              return (
                <tr key={comment.id} className={isParentComment ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {comment.medicalAdvice && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Tıbbi Tavsiye
                            </span>
                          )}
                          {comment.isHelpful && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Heart className="h-3 w-3 mr-1" />
                              Faydalı
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-900">
                          {isExpanded ? (
                            <div className="whitespace-pre-wrap">{comment.content}</div>
                          ) : (
                            <div>{getContentPreview(comment.content)}</div>
                          )}
                          {comment.content.length > 100 && (
                            <button
                              onClick={() => toggleExpanded(comment.id)}
                              className="text-health-600 hover:text-health-700 text-xs mt-1"
                            >
                              {isExpanded ? 'Daha az göster' : 'Devamını oku'}
                            </button>
                          )}
                        </div>
                        {!isParentComment && (
                          <div className="text-xs text-gray-500 mt-1">
                            ↳ Yanıt
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {comment.isAnonymous ? (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        ) : comment.author.profilePicture ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={comment.author.profilePicture}
                            alt={comment.author.username}
                            onError={(e) => {
                              // Hata durumunda SVG icon ile değiştir
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="h-8 w-8 rounded-full bg-health-100 flex items-center justify-center">
                                    <svg class="h-4 w-4 text-health-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-health-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-health-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getAuthorName(comment)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <div className="text-sm text-gray-900">
                        {(() => {
                          try {
                            const date = new Date(comment.createdAt);
                            if (isNaN(date.getTime())) {
                              return 'Geçersiz tarih';
                            }
                            return formatDistanceToNow(date, { addSuffix: true, locale: tr });
                          } catch (error) {
                            return 'Geçersiz tarih';
                          }
                        })()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                        <span>{comment.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsDown className="h-4 w-4 text-red-500 mr-1" />
                        <span>{comment.dislikeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{comment.replyCount}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(comment)}
                          className="text-health-600 hover:text-health-700 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(comment)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(comment)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
