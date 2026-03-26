"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Star, Loader2, Package, ExternalLink } from 'lucide-react';

const INVENTORY_LABELS: Record<string, { label: string; color: string }> = {
  in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  coming_soon: { label: 'Coming Soon', color: 'bg-yellow-100 text-yellow-800' },
};

export default function AdminProductsClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-purple">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors text-sm font-semibold">
          <Plus size={16} /> New Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-purple animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-brand-gray-dark">No products yet. Create your first product!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-purple hidden md:table-cell">Inventory</th>
                  <th className="text-right px-4 py-3 font-semibold text-brand-purple">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const inv = INVENTORY_LABELS[p.inventoryStatus] || INVENTORY_LABELS.in_stock;
                  return (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] ? (
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-brand-purple truncate max-w-xs">{p.name}</p>
                            {p.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                <Star size={10} fill="currentColor" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="capitalize text-brand-gray-dark">{p.category?.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-purple">${p.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.color}`}>{inv.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {p.stripePaymentLink && (
                            <a href={p.stripePaymentLink} target="_blank" rel="noopener noreferrer" className="p-1.5 text-brand-gray-dark hover:text-brand-purple transition-colors" title="Open Stripe Link">
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <Link href={`/shop/${p.slug}`} className="p-1.5 text-brand-gray-dark hover:text-brand-purple transition-colors" title="View">
                            <Eye size={16} />
                          </Link>
                          <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 text-brand-gray-dark hover:text-brand-purple transition-colors" title="Edit">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-brand-gray-dark hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
