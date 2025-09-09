import Link from 'next/link';
import {
  UserCheck,
  FileText,
  MessageSquare,
  Flag,
  Calendar,
  Plus
} from 'lucide-react';

const quickActions = [
  {
    name: 'Uzman Başvurularını İncele',
    description: 'Bekleyen uzman başvurularını onaylayın',
    href: '/users/expert-applications',
    icon: UserCheck,
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    count: 5
  },
  {
    name: 'İçerik Moderasyonu',
    description: 'Onay bekleyen paylaşımları inceleyin',
    href: '/content/posts',
    icon: FileText,
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    count: 12
  },
  {
    name: 'Cevaplanmamış Sorular',
    description: 'Uzman ataması bekleyen sorular',
    href: '/content/questions',
    icon: MessageSquare,
    color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    count: 8
  },
  {
    name: 'Raporlanan İçerik',
    description: 'Kullanıcılar tarafından bildirilen içerik',
    href: '/content/reports',
    icon: Flag,
    color: 'bg-red-50 text-red-600 hover:bg-red-100',
    count: 3
  },
  {
    name: 'Yeni Etkinlik Oluştur',
    description: 'Sağlık etkinliği planla',
    href: '/events/create',
    icon: Plus,
    color: 'bg-green-50 text-green-600 hover:bg-green-100'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
        <p className="text-sm text-gray-600 mt-1">Sık kullanılan yönetim araçları</p>
      </div>
      
      <div className="p-6">
        <div className="grid gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
            >
              <div className={`p-3 rounded-lg ${action.color} transition-colors`}>
                <action.icon className="h-5 w-5" />
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 group-hover:text-gray-700">
                    {action.name}
                  </h4>
                  {action.count && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {action.count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
