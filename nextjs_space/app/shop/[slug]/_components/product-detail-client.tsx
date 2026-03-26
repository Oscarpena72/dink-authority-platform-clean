"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, ExternalLink, Home, Check, Clock, XCircle } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import { useLanguage } from '@/lib/i18n/language-context';

const INVENTORY_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  in_stock: { label: 'In Stock', icon: Check, color: 'text-green-600', bgColor: 'bg-green-50' },
  out_of_stock: { label: 'Out of Stock', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  coming_soon: { label: 'Coming Soon', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
};

export default function ProductDetailClient({ product, relatedProducts }: { product: any; relatedProducts: any[] }) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.images?.length > 0 ? product.images : [];
  const inv = INVENTORY_CONFIG[product.inventoryStatus] || INVENTORY_CONFIG.in_stock;
  const InvIcon = inv.icon;
  const canBuy = product.inventoryStatus !== 'out_of_stock' && !!product.stripePaymentLink;

  const prevImage = () => setSelectedImage((p: number) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setSelectedImage((p: number) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-brand-gray-dark mb-8">
          <Link href="/" className="hover:text-brand-purple transition-colors flex items-center gap-1"><Home size={14} /> {t('article.home')}</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-purple transition-colors">{t('shop.title')}</Link>
          <span>/</span>
          <span className="text-brand-purple font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {images.length > 0 ? (
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                        <ChevronLeft size={20} className="text-brand-purple" />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                        <ChevronRight size={20} className="text-brand-purple" />
                      </button>
                    </>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-brand-neon text-brand-purple-dark text-xs font-bold rounded-full flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {images.map((img: string, i: number) => (
                      <button key={i} onClick={() => setSelectedImage(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === i ? 'border-brand-purple shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}>
                        <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center">
                <ShoppingBag size={80} className="text-gray-200" />
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-neon">
              {product.category?.replace(/_/g, ' ')}
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-brand-purple mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-3xl font-heading font-black text-brand-purple">${product.price?.toFixed(2)}</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${inv.bgColor} ${inv.color}`}>
                <InvIcon size={14} /> {inv.label}
              </span>
            </div>

            {product.shortDescription && (
              <p className="text-brand-gray-dark text-lg mt-4 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Buy Now Button */}
            <div className="mt-8">
              {canBuy ? (
                <a href={product.stripePaymentLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand-neon text-brand-purple-dark font-bold text-lg rounded-xl hover:bg-brand-neon-dim transition-all duration-300 hover:shadow-lg hover:shadow-brand-neon/20">
                  <ShoppingBag size={22} />
                  {product.buttonLabel || t('shop.buyNow')}
                  <ExternalLink size={16} />
                </a>
              ) : product.inventoryStatus === 'out_of_stock' ? (
                <button disabled className="inline-flex items-center gap-3 px-8 py-4 bg-gray-200 text-gray-500 font-bold text-lg rounded-xl cursor-not-allowed">
                  <XCircle size={22} /> Out of Stock
                </button>
              ) : !product.stripePaymentLink ? (
                <button disabled className="inline-flex items-center gap-3 px-8 py-4 bg-gray-200 text-gray-500 font-bold text-lg rounded-xl cursor-not-allowed">
                  <Clock size={22} /> Coming Soon
                </button>
              ) : null}
            </div>

            {/* Full Description */}
            {product.fullDescription && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h2 className="text-lg font-heading font-bold text-brand-purple mb-3">{t('shop.description')}</h2>
                <div className="text-brand-gray-dark leading-relaxed whitespace-pre-line">{product.fullDescription}</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-heading font-black text-brand-purple mb-6">{t('shop.relatedProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/shop/${rp.slug}`} className="group block">
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="relative aspect-square bg-gray-50">
                      {rp.images?.[0] ? (
                        <Image src={rp.images[0]} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={32} className="text-gray-200" /></div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-brand-purple truncate">{rp.name}</h3>
                      <span className="text-sm font-bold text-brand-purple">${rp.price?.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
