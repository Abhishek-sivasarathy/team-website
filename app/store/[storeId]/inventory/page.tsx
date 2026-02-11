'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { 
  Plus, 
  Search, 
  ChevronLeft,
  Grid,
  FileText,
  Calendar,
  Settings,
  Package
} from 'lucide-react';

export default function StoreInventoryPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, getProductsByStore, toggleProductStock } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const store = getStoreById(storeId as string);
  const allProducts = getProductsByStore(storeId as string);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser || !store) {
    return null;
  }

  const categories = ['All Items', ...new Set(allProducts.map((p) => p.category))];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Items' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Store Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-primary font-medium text-sm">Inventory</p>
          </div>
          <Button
            onClick={() => router.push(`/store/${storeId}/add-product`)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
              <Button
                onClick={() => router.push(`/store/${storeId}/add-product`)}
                variant="ghost"
                className="mt-4"
              >
                Add your first product
              </Button>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl ${
                    product.inStock ? 'bg-gray-100' : 'bg-gray-200 opacity-50'
                  }`}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      '📦'
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg ${
                      product.inStock ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-primary font-bold text-lg">
                        ₹{product.price.toFixed(2)}
                      </p>
                      {product.inStock ? (
                        <Badge variant="success" size="sm">IN STOCK</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">OUT OF STOCK</Badge>
                      )}
                      {product.inStock && product.quantity < 10 && (
                        <Badge variant="warning" size="sm">
                          Only {product.quantity} left
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stock Toggle */}
                  <div className="flex items-center gap-2">
                    <Toggle
                      checked={product.inStock}
                      onChange={() => toggleProductStock(product.id)}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-around items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center gap-1"
            >
              <Grid className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-xs text-primary font-medium">Inventory</span>
            </button>
            <button
              onClick={() => router.push(`/store/${storeId}/orders`)}
              className="flex flex-col items-center gap-1"
            >
              <Calendar className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500">Orders</span>
            </button>
            <button
              onClick={() => router.push(`/store/${storeId}/billing`)}
              className="flex flex-col items-center gap-1"
            >
              <FileText className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500">Billing</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Settings className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
