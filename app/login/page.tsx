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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Campus Admin</h1>
          <p className="text-purple-200">Inventory & Order Control</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">Secure access for authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="e.g. manager@campus.edu"
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
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-dark font-medium">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full flex items-center justify-center gap-2" size="lg">
              Admin Login
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              🔒 ENCRYPTED SESSION
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              Not an admin?{' '}
              <a href="#" className="text-primary hover:text-primary-dark font-medium">
                Go to Kiosk Home
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white text-xs font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-purple-100">
            <p>Super Admin: admin@campus.edu</p>
            <p>Cafe Manager: cafe.manager@campus.edu</p>
            <p>Mart Manager: mart.manager@campus.edu</p>
            <p className="text-purple-300 italic mt-2">Password: any (for prototype)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
