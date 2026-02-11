'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { STORE_CATEGORIES } from '@/lib/mockData';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, Upload, Check } from 'lucide-react';

export default function AddProductPage() {
  const { storeId } = useParams();
  const { currentUser, getStoreById, addProduct } = useApp();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    quantity: '50',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const store = getStoreById(storeId as string);

  useEffect(() => {
    if (!currentUser || !store) {
      router.push('/dashboard');
    }
  }, [currentUser, store, router]);

  if (!currentUser || !store) return null;

  const storeCategories = STORE_CATEGORIES[storeId as keyof typeof STORE_CATEGORIES] || [];
  const categoryOptions = storeCategories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  // Set default category
  useEffect(() => {
    if (storeCategories.length > 0 && !formData.category) {
      setFormData({ ...formData, category: storeCategories[0] });
    }
  }, [storeCategories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProduct({
      storeId: storeId as string,
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: imagePreview || '',
      inStock: true,
      quantity: parseInt(formData.quantity),
    });

    setShowSuccess(true);
    setTimeout(() => {
      router.push(`/store/${storeId}/inventory`);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Added!</h2>
          <p className="text-gray-500">Redirecting to inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Inventory
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">{store.name}</p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="product-image"
                />
                <label htmlFor="product-image" className="cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-32 h-32 mx-auto rounded-lg object-cover mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <p className="text-primary font-medium">Upload Product Image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG UP TO 5MB</p>
                </label>
              </div>
            </div>

            {/* Product Name */}
            <Input
              label="Product Name"
              type="text"
              placeholder="e.g., Iced Caramel Latte"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Product Price */}
            <Input
              label="Product Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            {/* Product Category */}
            {categoryOptions.length > 0 && (
              <Select
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            )}

            {/* Initial Quantity */}
            <Input
              label="Initial Quantity"
              type="number"
              placeholder="50"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Product
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
