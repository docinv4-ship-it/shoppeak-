"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { AliProduct } from "@/lib/aliexpress";
import { Loader2, RefreshCw } from "lucide-react";

const FEED_KEYWORDS = [
  "trending 2024", "new arrival", "best seller electronics", "fashion trending",
  "home decor luxury", "smartphone deal", "jewelry sale", "outdoor gear",
  "gaming accessories", "kitchen appliance", "watch luxury", "wireless earbuds",
];

export default function FeedPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [keywordIdx, setKeywordIdx] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const keyword = FEED_KEYWORDS[keywordIdx % FEED_KEYWORDS.length];
      const seed = parseInt(sessionStorage?.getItem?.("sp_feed_seed") || "0") || (() => { const s = Math.floor(Math.random() * 9999)+1; sessionStorage?.setItem?.("sp_feed_seed", String(s)); return s; })();
      const res = await fetch(`/api/products/featured?q=${encodeURIComponent(keyword)}&page=${page}&pageSize=50&seed=${seed}`);
      const data = await res.json();
      const newProducts: AliProduct[] = data.products || [];
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => {
          const existing = new Set(prev.map(p => p.product_id));
          const unique = newProducts.filter(p => !existing.has(p.product_id));
          return [...prev, ...unique];
        });
        setPage(p => p + 1);
        setKeywordIdx(i => i + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, keywordIdx]);

  useEffect(() => { loadMore(); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleRefresh = () => {
    setProducts([]);
    setPage(1);
    setKeywordIdx(Math.floor(Math.random() * FEED_KEYWORDS.length));
    setHasMore(true);
    loadMore();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Discovery Feed</h1>
          <p className="text-sm text-gray-500">Curated products refreshed continuously</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm text-orange-500 border border-orange-200 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((p) => (
          <ProductCard
            key={p.product_id}
            id={p.product_id}
            title={p.product_title}
            image={p.product_main_image_url}
            salePrice={p.app_sale_price || p.sale_price}
            originalPrice={p.original_price}
            discount={p.discount}
            rating={p.evaluate_rate}
            soldCount={p.lastest_volume}
            source="feed"
          />
        ))}
      </div>

      <div ref={loaderRef} className="flex justify-center py-10">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading more products...</span>
          </div>
        )}
        {!hasMore && !loading && (
          <p className="text-gray-400 text-sm">You've seen it all! <button onClick={handleRefresh} className="text-orange-500 hover:underline">Refresh feed</button></p>
        )}
      </div>
    </div>
  );
}
