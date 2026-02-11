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
  AlertTriangle,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isSuperAdmin ? 'Admin Portal' : 'Store Management'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isSuperAdmin ? 'Select a campus outlet.' : 'Manage your store inventory and orders'}
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => router.push('/store/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Store
            </Button>
          )}
        </div>

        {/* Quick Stats (only for super admin) */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">TODAY'S REVENUE</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₹{globalStats.todayRevenue.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      +{globalStats.revenueChange.toFixed(1)}% vs yesterday
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">TOTAL PRODUCTS</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{globalStats.totalProducts}</p>
                  <p className="text-sm text-gray-500 mt-2">Across all stores</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">TOTAL STORES</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stores.length}</p>
                  <p className="text-sm text-gray-500 mt-2">Active outlets</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Store Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isSuperAdmin ? 'Store Selection' : 'Your Store'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userStores.map((store) => (
              <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl">
                        {getStoreIcon(store.icon)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                        <p className="text-gray-500 text-sm">{store.description}</p>
                      </div>
                    </div>
                    <Badge variant={store.isActive ? 'success' : 'danger'}>
                      {store.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => router.push(`/store/${store.id}/inventory`)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Manage Store
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-500">View detailed reports</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bills</h3>
                <p className="text-sm text-gray-500">Payment history</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-500">Configure system</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
