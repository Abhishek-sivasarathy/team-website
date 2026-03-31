'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProduct({
      storeId: storeId as string,
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category || 'General',
      image: imagePreview || '',
      inStock: true,
      quantity: parseInt(formData.quantity),
    });

    setShowSuccess(true);

    setTimeout(() => {
      router.push(`/store/${storeId}/inventory`);
    }, 1500);
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Product Added
          </h2>
          <p className="text-sm text-gray-500">
            Redirecting to inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Add Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {store.name}
          </p>
        </div>

        {/* Form */}
        <Card className="space-y-6">

          {/* Image Upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Product Image</p>

            <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <input
                type="file"
                hidden
                id="upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <label htmlFor="upload" className="cursor-pointer block">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-24 h-24 mx-auto rounded-lg object-cover mb-2"
                  />
                ) : (
                  <Upload className="mx-auto text-gray-400" />
                )}

                <p className="text-sm text-gray-600 mt-2">
                  Upload product image
                </p>
              </label>
            </div>
          </div>

          {/* Name */}
          <Input
            label="Product Name"
            placeholder="e.g. Cold Coffee"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          {/* Price */}
          <Input
            label="Price (₹)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />

          {/* Category */}
          <Select
            label="Category"
            options={[
              { value: 'General', label: 'General' },
              { value: 'Beverages', label: 'Beverages' },
              { value: 'Snacks', label: 'Snacks' },
            ]}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          {/* Quantity */}
          <Input
            label="Initial Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Add Product
            </Button>
          </div>

        </Card>
      </div>
    </div>
  );
}