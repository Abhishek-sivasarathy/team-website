'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, Upload } from 'lucide-react';

export default function CreateStorePage() {
  const { currentUser, addStore } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'cafe',
    icon: '☕',
    openTime: '08:00 AM',
    closeTime: '08:00 PM',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'super-admin') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'super-admin') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addStore({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      isActive: true,
      operatingHours: {
        days: 'Mon - Fri',
        openTime: formData.openTime,
        closeTime: formData.closeTime,
      },
    });

    router.push('/dashboard');
  };

  const categoryOptions = [
    { value: 'cafe', label: 'Cafe' },
    { value: 'mart', label: 'Mart' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'premium', label: 'Premium' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

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
          <h1 className="text-2xl sm:text-3xl font-semibold">Create Store</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a new campus outlet
          </p>
        </div>

        {/* Form */}
        <Card className="space-y-6">

          {/* Image Upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Store Icon</p>

            <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <input type="file" hidden id="upload" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />

              <label htmlFor="upload" className="cursor-pointer block">
                {imagePreview ? (
                  <img src={imagePreview} className="w-20 h-20 mx-auto rounded-lg mb-2 object-cover" />
                ) : (
                  <Upload className="mx-auto text-gray-400" />
                )}
                <p className="text-sm text-gray-600 mt-2">Upload icon</p>
              </label>
            </div>
          </div>

          <Input
            label="Store Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="input mt-2"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          {/* Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Open Time"
              value={formData.openTime}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
            />
            <Input
              label="Close Time"
              value={formData.closeTime}
              onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
            />
          </div>

          <Button type="submit" onClick={handleSubmit} className="w-full">
            Create Store
          </Button>

        </Card>
      </div>
    </div>
  );
}