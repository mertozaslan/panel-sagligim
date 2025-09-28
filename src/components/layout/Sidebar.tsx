'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  UserCheck,
  MessageSquare,
  Flag,
  Heart,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Kullanıcı Yönetimi',
    href: '/users',
    icon: Users,
    children: [
      { name: 'Kullanıcılar', href: '/users' },
      { name: 'Uzman Başvuruları', href: '/users/expert-applications' },
    ]
  },
  {
    name: 'İçerik Moderasyonu',
    href: '/content',
    icon: FileText,
    children: [
      { name: 'Paylaşımlar', href: '/content/posts' },
      { name: 'Sorular', href: '/content/questions' },
      { name: 'Raporlanan İçerik', href: '/content/reports' },
    ]
  },
  {
    name: 'Etkinlik Yönetimi',
    href: '/events',
    icon: Calendar,
  },
  {
    name: 'Sistem Ayarları',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border hover:bg-gray-50"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b">
            <Heart className="h-8 w-8 text-health-500" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Sağlık Hep</h1>
              <p className="text-sm text-gray-500">Yönetim Paneli</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href
                      ? 'bg-health-50 text-health-700 border-r-2 border-health-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
                
                {/* Sub-navigation */}
                {item.children && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={clsx(
                          'block px-3 py-2 text-sm rounded-lg transition-colors',
                          pathname === child.href
                            ? 'bg-health-50 text-health-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-health-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
