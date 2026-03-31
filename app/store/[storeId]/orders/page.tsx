'use client';

import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const { storeId } = useParams();
  const { getOrdersByStore, updateOrderStatus } = useApp();

  const orders = getOrdersByStore(storeId as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold">Orders</h1>

        {orders.map(order => (
          <Card key={order.id} className="space-y-3">
            <p className="font-semibold">#{order.id}</p>
            <p>{order.studentName}</p>

            <div className="flex gap-2">
              <Button onClick={() => updateOrderStatus(order.id, 'completed')}>
                Complete
              </Button>
              <Button variant="danger">
                Cancel
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}