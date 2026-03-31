'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Search, ChevronLeft, Plus } from 'lucide-react';

export default function StoreInventoryPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, getProductsByStore, toggleProductStock } = useApp();
  const router = useRouter();

  const [search, setSearch] = useState('');

  const store = getStoreById(storeId as string);
  const products = getProductsByStore(storeId as string);

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser]);

  if (!store) return null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-500">
            <ChevronLeft />
          </button>

          <h1 className="text-xl font-semibold">{store.name}</h1>

          <Button onClick={() => router.push(`/store/${storeId}/add-product`)}>
            <Plus size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">₹{p.price}</p>
              </div>

              <Toggle
                checked={p.inStock}
                onChange={() => toggleProductStock(p.id)}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}