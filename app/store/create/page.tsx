'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, Upload, HelpCircle } from 'lucide-react';

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
    { value: 'mart', label: 'Mart/Grocery' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'premium', label: 'Premium Store' },
  ];

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
          Back
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Store</h1>
              <p className="text-gray-500 mt-1">ADMIN PORTAL</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Store</h2>
          <p className="text-gray-500 mb-6">Enter details to set up a new campus outlet.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Icon
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="store-icon"
                />
                <label htmlFor="store-icon" className="cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Store icon preview"
                      className="w-24 h-24 mx-auto rounded-lg object-cover mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <p className="text-primary font-medium">Upload Store Icon</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG UP TO 5MB</p>
                </label>
              </div>
            </div>

            {/* Store Name */}
            <Input
              label="STORE NAME"
              type="text"
              placeholder="e.g., REC GRILL"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DESCRIPTION
              </label>
              <textarea
                placeholder="Briefly describe the store's offerings..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                rows={4}
                required
              />
            </div>

            {/* Store Category */}
            <Select
              label="STORE CATEGORY/TYPE"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            {/* Operating Hours */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  OPERATING HOURS
                </label>
                <button
                  type="button"
                  className="text-sm text-primary font-medium hover:text-primary-dark"
                >
                  APPLY TO ALL DAYS
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-gray-700 font-medium">Mon - Fri</div>
                <Input
                  type="text"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                  placeholder="08:00 AM"
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">to</span>
                  <Input
                    type="text"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    placeholder="08:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Create Store
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
