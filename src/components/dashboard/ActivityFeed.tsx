import { ActivityLog } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  UserPlus,
  FileText,
  MessageSquare,
  Calendar,
  Flag,
  UserCheck,
  Clock
} from 'lucide-react';

const activityIcons = {
  user_registered: UserPlus,
  expert_applied: UserCheck,
  expert_verified: UserCheck,
  post_published: FileText,
  question_asked: MessageSquare,
  question_answered: MessageSquare,
  event_created: Calendar,
  content_reported: Flag,
  content_moderated: Clock,
};

const activityColors = {
  user_registered: 'text-green-600 bg-green-50',
  expert_applied: 'text-blue-600 bg-blue-50',
  expert_verified: 'text-green-600 bg-green-50',
  post_published: 'text-purple-600 bg-purple-50',
  question_asked: 'text-orange-600 bg-orange-50',
  question_answered: 'text-green-600 bg-green-50',
  event_created: 'text-blue-600 bg-blue-50',
  content_reported: 'text-red-600 bg-red-50',
  content_moderated: 'text-gray-600 bg-gray-50',
};

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Henüz aktivite bulunmuyor
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.action];
            const colorClass = activityColors[activity.action];
            
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user.name}</span>
                      {' '}
                      <span>{activity.description}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(activity.createdAt, { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-sm text-health-600 hover:text-health-700 font-medium">
            Tüm aktiviteleri görüntüle
          </button>
        </div>
      )}
    </div>
  );
}
