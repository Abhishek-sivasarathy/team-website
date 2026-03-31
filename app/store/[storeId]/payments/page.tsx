'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export default function PaymentsPage() {
  const { storeId } = useParams();
  const { getPaymentsByStore } = useApp();

  const payments = getPaymentsByStore(storeId as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 space-y-3">
        <h1 className="text-xl font-semibold">Payments</h1>

        {payments.map(p => (
          <Card key={p.id} className="flex justify-between">
            <span>{p.transactionId}</span>
            <span className="text-green-600 font-semibold">₹{p.amount}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}