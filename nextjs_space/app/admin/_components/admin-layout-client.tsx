"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FileText, Calendar, Image as ImageIcon,
  Mail, Settings, LogOut, Menu, X, Home, ChevronRight, Trophy, BookOpen, Users, ShoppingBag, Megaphone, Globe, MonitorPlay, Handshake, Shield, Info
} from 'lucide-react';
import { canAccess, ROLE_LABELS, type Role } from '@/lib/roles';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Community', href: '/admin/community', icon: Megaphone },
  { label: 'Countries', href: '/admin/countries', icon: Globe },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Events', href: '/admin/events', icon: Calendar },
  { label: 'Results', href: '/admin/results', icon: Trophy },
  { label: 'Magazine', href: '/admin/magazine', icon: BookOpen },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Sponsors', href: '/admin/sponsors', icon: MonitorPlay },
  { label: 'About Page', href: '/admin/about', icon: Info },
  { label: 'Footer', href: '/admin/footer-partners', icon: Handshake },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { label: 'Users', href: '/admin/users', icon: Shield },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayoutClient({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = (session?.user?.role ?? 'viewer') as Role;

  const filteredNav = useMemo(
    () => NAV_ITEMS.filter((item) => canAccess(userRole, item.href)),
    [userRole]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-purple transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/admin" className="relative h-8 w-40">
            <Image src="/images/logo.png" alt="Dink Authority" fill className="object-contain" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item: any) => {
            const isActive = pathname === item?.href || (item?.href !== '/admin' && pathname?.startsWith?.(item?.href ?? '___'));
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-neon/10 text-brand-neon'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item?.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-white/60 text-xs mb-1">{session?.user?.email ?? ''}</div>
          <div className="text-brand-neon text-[10px] font-semibold uppercase tracking-wider mb-2">{ROLE_LABELS[userRole] ?? userRole}</div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 text-white/70 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1 text-sm text-brand-gray-dark">
            <Link href="/admin" className="hover:text-brand-purple">Admin</Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight size={14} />
                <span className="text-brand-purple font-medium capitalize">{pathname?.split?.('/')?.pop?.() ?? ''}</span>
              </>
            )}
          </div>
          <div className="ml-auto">
            <Link href="/" target="_blank" className="text-sm text-brand-purple hover:text-brand-neon-dim transition-colors font-medium">
              View Site →
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
