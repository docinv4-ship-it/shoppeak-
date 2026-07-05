"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Star, ExternalLink } from "lucide-react";
import { AliProduct } from "@/lib/aliexpress";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const [slots, setSlots] = useState<(AliProduct | null)[]>([null, null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AliProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&pageSize=12`);
      const data = await res.json();
      setSearchResults(data.products || []);
    } finally {
      setSearching(false);
    }
  };

  const addToSlot = (product: AliProduct, slotIdx: number) => {
    setSlots(prev => { const next = [...prev]; next[slotIdx] = product; return next; });
    setSearchResults([]);
    setSearchQuery("");
    setActiveSlot(null);
  };

  const removeFromSlot = (slotIdx: number) => {
    setSlots(prev => { const next = [...prev]; next[slotIdx] = null; return next; });
  };

  const filled = slots.filter(Boolean) as AliProduct[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Compare Products</h1>
        <p className="text-gray-500 text-sm mt-1">Add up to 3 products to compare side by side</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(searchQuery); }}
            placeholder="Search product to compare..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
          >
            Search
          </button>
        </div>
        {searching && <p className="text-xs text-gray-500 mt-2">Searching...</p>}
        {searchResults.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {searchResults.map(p => {
              const emptySlot = slots.findIndex(s => !s);
              return (
                <button
                  key={p.product_id}
                  onClick={() => {
                    const slot = activeSlot !== null ? activeSlot : emptySlot;
                    if (slot >= 0 && slot < 3) addToSlot(p, slot);
                  }}
                  className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
                >
                  <img src={p.product_main_image_url} alt="" className="w-10 h-10 object-contain flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 line-clamp-2">{p.product_title}</p>
                    <p className="text-xs font-bold text-orange-500">{formatPrice(p.sale_price)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-3 gap-4">
        {slots.map((product, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {product ? (
              <>
                <div className="relative">
                  <div className="aspect-square bg-gray-50 relative">
                    <Image src={product.product_main_image_url} alt={product.product_title} fill className="object-contain p-3" unoptimized />
                  </div>
                  <button onClick={() => removeFromSlot(idx)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-700 line-clamp-3 mb-2">{product.product_title}</p>
                  <p className="text-lg font-black text-orange-600 mb-1">{formatPrice(product.sale_price)}</p>
                  {product.original_price && parseFloat(product.original_price) > parseFloat(product.sale_price) && (
                    <p className="text-xs text-gray-400 line-through mb-2">{formatPrice(product.original_price)}</p>
                  )}
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= Math.round(parseFloat(product.evaluate_rate || "96")/20) ? "fill-orange-400 text-orange-400" : "text-gray-200 fill-gray-200"} />)}
                    <span className="text-xs text-gray-500">{(product.lastest_volume||0).toLocaleString()} sold</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600 border-t pt-2 mb-3">
                    <div className="flex justify-between"><span>Discount</span><span className="font-medium text-red-500">{product.discount || "0%"}</span></div>
                    <div className="flex justify-between"><span>Rating</span><span className="font-medium">{(parseFloat(product.evaluate_rate||"96")/20).toFixed(1)}/5</span></div>
                    <div className="flex justify-between"><span>Sold</span><span className="font-medium">{(product.lastest_volume||0).toLocaleString()}</span></div>
                  </div>
                  <a href={`/go/${product.product_id}?src=compare`} target="_blank" rel="noopener noreferrer sponsored" className="w-full flex items-center justify-center gap-1 bg-orange-500 text-white py-2 rounded-lg text-xs hover:bg-orange-600 transition-colors">
                    Buy Now <ExternalLink size={10} />
                  </a>
                </div>
              </>
            ) : (
              <button
                onClick={() => setActiveSlot(idx)}
                className="w-full aspect-square flex flex-col items-center justify-center gap-3 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                <Plus size={32} />
                <span className="text-sm">Add Product {idx + 1}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {filled.length >= 2 && (
        <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm">
          <h3 className="font-bold text-gray-800 mb-2">Quick Verdict</h3>
          {(() => {
            const cheapest = filled.reduce((a, b) => parseFloat(a.sale_price) < parseFloat(b.sale_price) ? a : b);
            const bestRated = filled.reduce((a, b) => parseFloat(a.evaluate_rate||"0") > parseFloat(b.evaluate_rate||"0") ? a : b);
            const mostPopular = filled.reduce((a, b) => (a.lastest_volume||0) > (b.lastest_volume||0) ? a : b);
            return (
              <div className="space-y-1 text-gray-600">
                <p>💰 <strong>Best price:</strong> {cheapest.product_title.slice(0,40)}... — {formatPrice(cheapest.sale_price)}</p>
                <p>⭐ <strong>Best rated:</strong> {bestRated.product_title.slice(0,40)}... — {(parseFloat(bestRated.evaluate_rate||"96")/20).toFixed(1)}/5</p>
                <p>🔥 <strong>Most popular:</strong> {mostPopular.product_title.slice(0,40)}... — {(mostPopular.lastest_volume||0).toLocaleString()} sold</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
