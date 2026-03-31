'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, stores, getDashboardStats } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === 'super-admin';
  const userStores = isSuperAdmin
    ? stores
    : stores.filter((store) => store.id === currentUser.storeId);

  const globalStats = getDashboardStats();

  const getStoreIcon = (icon: string) => {
    const icons: { [key: string]: string } = {
      '☕': '☕',
      '🛒': '🛒',
      '🍱': '🍱',
      '🎁': '🎁',
    };
    return icons[icon] || '🏪';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {isSuperAdmin ? 'Admin Portal' : 'Store Management'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isSuperAdmin
                ? 'Manage and monitor all campus outlets'
                : 'Manage your store inventory and orders'}
            </p>
          </div>

          {isSuperAdmin && (
            <Button
              onClick={() => router.push('/store/create')}
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Store
            </Button>
          )}
        </div>

        {/* Stats */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-semibold mt-2">
                    ₹{globalStats.todayRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-2xl font-semibold mt-2">
                    {globalStats.totalProducts}
                  </p>
                </div>
                <Package className="text-purple-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stores</p>
                  <p className="text-2xl font-semibold mt-2">
                    {stores.length}
                  </p>
                </div>
                <ShoppingCart className="text-blue-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Stores */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {isSuperAdmin ? 'Stores' : 'Your Store'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userStores.map((store) => (
              <Card
                key={store.id}
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between mb-4">
                  <div className="text-3xl">
                    {getStoreIcon(store.icon)}
                  </div>
                  <Badge variant={store.isActive ? 'success' : 'danger'}>
                    {store.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {store.description}
                </p>

                <Button
                  onClick={() => router.push(`/store/${store.id}/inventory`)}
                  className="w-full flex justify-center items-center gap-2"
                >
                  Open
                  <ChevronRight size={16} />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card className="p-6 hover:shadow-md cursor-pointer">
            <BarChart3 />
            <p>Analytics</p>
          </Card>

          <Card className="p-6 hover:shadow-md cursor-pointer">
            <FileText />
            <p>Bills</p>
          </Card>

          <Card className="p-6 hover:shadow-md cursor-pointer">
            <Settings />
            <p>Settings</p>
          </Card>
        </div>

      </div>
    </div>
  );
}