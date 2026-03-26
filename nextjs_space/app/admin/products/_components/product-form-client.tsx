"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Loader2, Plus, X, Package, Link as LinkIcon } from 'lucide-react';

const CATEGORIES = [
  { value: 'merchandise', label: 'Merchandise' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'drinkware', label: 'Drinkware' },
  { value: 'other', label: 'Other' },
];

const INVENTORY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'coming_soon', label: 'Coming Soon' },
];

interface Props {
  product?: any;
}

export default function ProductFormClient({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [category, setCategory] = useState(product?.category || 'merchandise');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(product?.fullDescription || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [stripePaymentLink, setStripePaymentLink] = useState(product?.stripePaymentLink || '');
  const [buttonLabel, setButtonLabel] = useState(product?.buttonLabel || 'Buy Now');
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [inventoryStatus, setInventoryStatus] = useState(product?.inventoryStatus || 'in_stock');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    if (images.length >= 5) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        name, slug, category, price, shortDescription, fullDescription,
        images, stripePaymentLink, buttonLabel, isActive, isFeatured, inventoryStatus,
      };

      const url = isEdit ? `/api/products/${product.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-brand-purple" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-brand-purple">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-brand-purple mb-4 flex items-center gap-2">
            <Package size={20} /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={200}
              placeholder="Brief description for product cards"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5}
              placeholder="Detailed product description for the product page"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-brand-purple mb-4">Product Images (up to 5)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                <Image src={img} alt={`Product ${i + 1}`} fill className="object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-brand-purple text-white text-[10px] rounded font-medium">Main</span>
                )}
              </div>
            ))}
            {images.length < 5 && (
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                <Package size={24} />
              </div>
            )}
          </div>
          {images.length < 5 && (
            <div className="flex gap-2">
              <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL and click Add"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
              <button type="button" onClick={addImage}
                className="px-4 py-2 bg-brand-gray text-brand-purple rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1">
                <Plus size={14} /> Add
              </button>
            </div>
          )}
        </div>

        {/* Stripe & Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-brand-purple mb-4 flex items-center gap-2">
            <LinkIcon size={20} /> Payment & Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Payment Link</label>
              <input type="url" value={stripePaymentLink} onChange={(e) => setStripePaymentLink(e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
              <p className="text-xs text-gray-500 mt-1">Create a Payment Link in your Stripe Dashboard and paste it here.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                <input type="text" value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Buy Now"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Status</label>
                <select value={inventoryStatus} onChange={(e) => setInventoryStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm">
                  {INVENTORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple" />
                <span className="text-sm text-gray-700">Active (visible in shop)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple" />
                <span className="text-sm text-gray-700">Featured product</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.push('/admin/products')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}
