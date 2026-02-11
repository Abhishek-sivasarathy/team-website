'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, DollarSign, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';

export default function PaymentsPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, getPaymentsByStore, getOrdersByStore } = useApp();
  const router = useRouter();

  const store = getStoreById(storeId as string);
  const payments = getPaymentsByStore(storeId as string);
  const orders = getOrdersByStore(storeId as string);

  useEffect(() => {
    if (!currentUser || !store) {
      router.push('/dashboard');
    }
  }, [currentUser, store, router]);

  if (!currentUser || !store) return null;

  const successfulPayments = payments.filter((p) => p.status === 'success');
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPayments = successfulPayments.filter(
    (p) => new Date(p.timestamp) >= today
  );
  const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  const getOrderDetails = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${time} • ${dateStr}`;
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
          <p className="text-gray-500 mt-1">Money Collection & Payment History</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">TODAY'S REVENUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{todayRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{todayPayments.length} transactions</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">TOTAL REVENUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{successfulPayments.length} total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">AVG. ORDER VALUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{successfulPayments.length > 0 ? (totalRevenue / successfulPayments.length).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Per transaction</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
          {successfulPayments.length === 0 ? (
            <Card className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No payments yet</p>
              <p className="text-gray-400 text-sm mt-2">Completed payments will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {successfulPayments
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((payment) => {
                  const order = getOrderDetails(payment.orderId);
                  return (
                    <Card key={payment.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-gray-900">Order #{payment.orderId}</p>
                              <Badge variant="success" size="sm">
                                {payment.paymentMethod.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {order && (
                                <>
                                  <span>{order.studentName}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>{formatTimestamp(payment.timestamp)}</span>
                              <span>•</span>
                              <span className="font-mono text-xs">{payment.transactionId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-2xl font-bold text-green-600">
                            +₹{payment.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 uppercase">{payment.status}</p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order && order.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                              >
                                {item.quantity}x {item.productName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
