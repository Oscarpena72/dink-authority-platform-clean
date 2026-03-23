"use client";
import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPageClient() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'authenticated') {
    router.replace('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.replace('/admin');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative h-12 w-56 mx-auto mb-6">
            <Image src="/images/logo.png" alt="Dink Authority Magazine" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">Access the content management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark" />
                <input
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-purple mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e: any) => setPassword(e?.target?.value ?? '')}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-dark hover:text-brand-purple">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
