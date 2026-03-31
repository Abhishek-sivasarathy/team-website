'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-purple-900 px-4">
      
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Campus Admin
          </h1>
          <p className="text-sm text-white/70">
            Inventory & Order Control System
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="manager@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-600">Remember me</span>
              </label>

              <a href="#" className="text-primary hover:text-primary-dark font-medium">
                Forgot?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              🔒 Secure encrypted session
            </p>
          </div>
        </div>

        {/* Demo Box */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 text-xs text-white/80 space-y-1">
          <p className="font-medium text-white">Demo:</p>
          <p>admin@campus.edu</p>
          <p>cafe.manager@campus.edu</p>
          <p className="italic text-white/60">password: anything</p>
        </div>
      </div>
    </div>
  );
}
