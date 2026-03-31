'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { currentUser, logout } = useApp();
  const router = useRouter();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-lg shadow-sm">
            📊
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">
              Campus Admin
            </h1>
            <p className="text-xs text-gray-500">
              Control Panel
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser.role.replace('-', ' ')}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}