'use client';

import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export default function BillingPage() {
  const { storeId } = useParams();
  const { getPaymentsByStore } = useApp();

  const payments = getPaymentsByStore(storeId as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold">Billing</h1>

        {payments.map(p => (
          <Card key={p.id} className="flex justify-between">
            <span>Order #{p.orderId}</span>
            <span className="font-semibold text-green-600">₹{p.amount}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}