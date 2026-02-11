'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Filter,
  Search
} from 'lucide-react';

export default function BillingPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, getOrdersByStore, getPaymentsByStore } = useApp();
  const router = useRouter();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const store = getStoreById(storeId as string);
  const allOrders = getOrdersByStore(storeId as string);
  const allPayments = getPaymentsByStore(storeId as string);

  useEffect(() => {
    if (!currentUser || !store) {
      router.push('/dashboard');
    }
  }, [currentUser, store, router]);

  if (!currentUser || !store) return null;

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();

    switch (filterPeriod) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    const filteredOrders = allOrders.filter(
      (order) => new Date(order.createdAt) >= startDate
    );

    const filteredPayments = allPayments.filter(
      (payment) => new Date(payment.timestamp) >= startDate && payment.status === 'success'
    );

    return { filteredOrders, filteredPayments };
  };

  const { filteredOrders, filteredPayments } = getFilteredData();

  // Calculate statistics
  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter((o) => o.orderStatus === 'completed').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Search filter
  const searchFilteredOrders = filteredOrders.filter((order) =>
    order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'today': return "Today's";
      case 'week': return "This Week's";
      case 'month': return "This Month's";
      case 'all': return 'All Time';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/store/${storeId}/inventory`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Inventory
        </button>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-500 mt-1">Billing & Reports</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </Button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['today', 'week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                filterPeriod === period
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period === 'today' && 'Today'}
              {period === 'week' && 'This Week'}
              {period === 'month' && 'This Month'}
              {period === 'all' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{getPeriodLabel().toUpperCase()} REVENUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">TOTAL ORDERS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">COMPLETED</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">AVG ORDER VALUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Order Details Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          {searchFilteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Orders will appear here once placed'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchFilteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-sm text-gray-900">{order.id}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.studentName}</p>
                          <p className="text-sm text-gray-500">{order.studentEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        {order.paymentStatus === 'completed' ? (
                          <Badge variant="success" size="sm">PAID</Badge>
                        ) : order.paymentStatus === 'pending' ? (
                          <Badge variant="warning" size="sm">PENDING</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">FAILED</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {order.orderStatus === 'completed' ? (
                          <Badge variant="success" size="sm">COMPLETED</Badge>
                        ) : order.orderStatus === 'cancelled' ? (
                          <Badge variant="danger" size="sm">CANCELLED</Badge>
                        ) : order.orderStatus === 'preparing' ? (
                          <Badge variant="warning" size="sm">PREPARING</Badge>
                        ) : (
                          <Badge variant="info" size="sm">PENDING</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Summary Card */}
        <Card className="p-6 mt-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Period Summary</p>
              <p className="text-lg font-semibold text-gray-900">
                {getPeriodLabel()} report shows {totalOrders} orders worth ₹{totalRevenue.toFixed(2)}
              </p>
            </div>
            <Button variant="ghost" className="text-primary">
              <Calendar className="w-5 h-5 mr-2" />
              View Calendar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
