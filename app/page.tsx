'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-purple-900">
      <div className="text-center text-white">
        <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Loading Campus Admin...</p>
      </div>
    </div>
  );
}
