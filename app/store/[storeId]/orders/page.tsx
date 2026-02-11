'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, Clock, DollarSign, User, Package, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, getOrdersByStore, updateOrderStatus } = useApp();
  const router = useRouter();

  const store = getStoreById(storeId as string);
  const orders = getOrdersByStore(storeId as string);

  useEffect(() => {
    if (!currentUser || !store) {
      router.push('/dashboard');
    }
  }, [currentUser, store, router]);

  if (!currentUser || !store) return null;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === 'pending' || order.orderStatus === 'preparing'
  );

  const completedOrders = orders.filter((order) => order.orderStatus === 'completed');

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'completed') return <Badge variant="success">PAID</Badge>;
    if (status === 'pending') return <Badge variant="warning">PENDING</Badge>;
    return <Badge variant="danger">FAILED</Badge>;
  };

  const getOrderStatusBadge = (status: string) => {
    if (status === 'pending') return <Badge variant="info">NEW</Badge>;
    if (status === 'preparing') return <Badge variant="warning">PREPARING</Badge>;
    if (status === 'ready') return <Badge variant="success">READY</Badge>;
    if (status === 'completed') return <Badge variant="success">COMPLETED</Badge>;
    return <Badge variant="danger">CANCELLED</Badge>;
  };

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
          <p className="text-gray-500 mt-1">Live Incoming Orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">ACTIVE ORDERS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">COMPLETED TODAY</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">TOTAL REVENUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Active Orders */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Orders</h2>
          {pendingOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No active orders</p>
              <p className="text-gray-400 text-sm mt-2">New orders will appear here in real-time</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                        {getOrderStatusBadge(order.orderStatus)}
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {order.studentName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                              📦
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {order.orderStatus === 'pending' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        variant="secondary"
                        className="flex-1"
                      >
                        Start Preparing
                      </Button>
                    )}
                    {order.orderStatus === 'preparing' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1"
                      >
                        Mark as Ready
                      </Button>
                    )}
                    {order.orderStatus === 'ready' && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="flex-1"
                      >
                        Complete Order
                      </Button>
                    )}
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                      variant="danger"
                      size="md"
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Completed</h2>
            <div className="space-y-3">
              {completedOrders.slice(0, 3).map((order) => (
                <Card key={order.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.studentName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {order.completedAt ? new Date(order.completedAt).toLocaleTimeString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
