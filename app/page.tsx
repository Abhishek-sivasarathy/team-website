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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-purple-900 px-4">
      <div className="w-full max-w-md text-center text-white space-y-6">
        
        {/* Logo / Branding */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Campus Admin
          </h1>
          <p className="text-sm text-white/70">
            Inventory & Billing System
          </p>
        </div>

        {/* Loader */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
          </div>
        </div>

        {/* Status Text */}
        <p className="text-sm sm:text-base text-white/80">
          Setting things up for you...
        </p>

      </div>
    </div>
  );
}