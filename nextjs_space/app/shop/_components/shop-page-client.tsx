"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Filter } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import { useLanguage } from '@/lib/i18n/language-context';

const INVENTORY_LABELS: Record<string, { label: string; color: string }> = {
  in_stock: { label: 'In Stock', color: 'bg-green-500' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-500' },
  coming_soon: { label: 'Coming Soon', color: 'bg-amber-500' },
};

const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'drinkware', label: 'Drinkware' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'merchandise', label: 'Merchandise' },
];

export default function ShopPageClient({ products }: { products: any[] }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('');

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-brand-purple text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ShoppingBag size={40} className="mx-auto mb-4 text-brand-neon" />
              <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">{t('shop.title')}</h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">{t('shop.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* Filter bar */}
        <section className="border-b border-gray-200 sticky top-0 bg-white z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
              <Filter size={16} className="text-brand-gray-dark flex-shrink-0" />
              {CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.value
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-gray text-brand-gray-dark hover:bg-gray-200'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-brand-gray-dark text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => {
                const inv = INVENTORY_LABELS[product.inventoryStatus] || INVENTORY_LABELS.in_stock;
                return (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/shop/${product.slug}`} className="group block">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        {/* Image */}
                        <div className="relative aspect-square bg-gray-50">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={48} className="text-gray-200" />
                            </div>
                          )}
                          {product.isFeatured && (
                            <span className="absolute top-3 left-3 px-2 py-1 bg-brand-neon text-brand-purple-dark text-xs font-bold rounded-full flex items-center gap-1">
                              <Star size={12} fill="currentColor" /> Featured
                            </span>
                          )}
                          {/* Inventory badge */}
                          <span className={`absolute top-3 right-3 px-2 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded-full ${inv.color}`}>
                            {inv.label}
                          </span>
                        </div>
                        {/* Info */}
                        <div className="p-4">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-purple/60">
                            {product.category?.replace(/_/g, ' ')}
                          </span>
                          <h3 className="font-heading font-bold text-brand-purple mt-1 text-base leading-tight group-hover:text-brand-purple-light transition-colors">
                            {product.name}
                          </h3>
                          {product.shortDescription && (
                            <p className="text-sm text-brand-gray-dark mt-1 line-clamp-2">{product.shortDescription}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xl font-heading font-black text-brand-purple">${product.price?.toFixed(2)}</span>
                            <span className="text-sm font-semibold text-brand-purple group-hover:underline">
                              {t('shop.viewProduct')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
