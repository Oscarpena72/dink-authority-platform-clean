"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Eye, FilePlus, Mail, Calendar, MessageSquare, Plus, ArrowRight } from 'lucide-react';

const STAT_CARDS = [
  { key: 'articles', label: 'Total Articles', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { key: 'published', label: 'Published', icon: Eye, color: 'bg-green-100 text-green-600' },
  { key: 'drafts', label: 'Drafts', icon: FilePlus, color: 'bg-yellow-100 text-yellow-600' },
  { key: 'subscribers', label: 'Subscribers', icon: Mail, color: 'bg-blue-100 text-blue-600' },
  { key: 'events', label: 'Active Events', icon: Calendar, color: 'bg-indigo-100 text-indigo-600' },
  { key: 'contacts', label: 'Contact Messages', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
];

export default function AdminDashboardClient({ stats, recentArticles }: { stats: any; recentArticles: any[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-purple">Dashboard</h1>
          <p className="text-brand-gray-dark text-sm mt-1">Welcome to the Dink Authority admin panel.</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {STAT_CARDS.map((card: any, i: number) => (
          <motion.div
            key={card?.key ?? i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card?.color ?? ''}`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-brand-purple">{(stats as any)?.[card?.key] ?? 0}</p>
            <p className="text-xs text-brand-gray-dark mt-1">{card?.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading font-bold text-brand-purple mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/articles/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-gray transition-colors">
              <Plus size={18} className="text-brand-neon" />
              <span className="text-sm font-medium text-brand-purple">Create New Article</span>
              <ArrowRight size={14} className="ml-auto text-brand-gray-dark" />
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-gray transition-colors">
              <Calendar size={18} className="text-brand-neon" />
              <span className="text-sm font-medium text-brand-purple">Manage Events</span>
              <ArrowRight size={14} className="ml-auto text-brand-gray-dark" />
            </Link>
            <Link href="/admin/homepage" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-gray transition-colors">
              <Eye size={18} className="text-brand-neon" />
              <span className="text-sm font-medium text-brand-purple">Edit Homepage Content</span>
              <ArrowRight size={14} className="ml-auto text-brand-gray-dark" />
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-gray transition-colors">
              <MessageSquare size={18} className="text-brand-neon" />
              <span className="text-sm font-medium text-brand-purple">Site Settings</span>
              <ArrowRight size={14} className="ml-auto text-brand-gray-dark" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-brand-purple">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-brand-neon-dim font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {(recentArticles ?? []).length === 0 ? (
              <p className="text-sm text-brand-gray-dark">No articles yet. Create your first one!</p>
            ) : (
              (recentArticles ?? []).map((a: any, i: number) => (
                <Link key={a?.id ?? i} href={`/admin/articles/${a?.id ?? ''}/edit`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-gray transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-purple truncate">{a?.title ?? 'Untitled'}</p>
                    <p className="text-xs text-brand-gray-dark">{a?.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    a?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a?.status ?? 'draft'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
