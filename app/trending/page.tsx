"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { TrendingUp, Flame, Zap } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "LAST_VOLUME_DESC" },
  { label: "Best Discount", value: "DISCOUNT_DESC" },
  { label: "Price: Low to High", value: "SALE_PRICE_ASC" },
  { label: "Price: High to Low", value: "SALE_PRICE_DESC" },
];

export default function TrendingPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCat, setSelectedCat] = useState("");
  const [sort, setSort] = useState("LAST_VOLUME_DESC");
  const seedRef = useRef(0);

  useEffect(() => {
    const key = "sp_trending_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: "50", seed: String(seedRef.current) });
      if (selectedCat) params.set("cat", selectedCat);
      const res = await fetch(`/api/products/trending?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(Math.min(data.totalPage || 100, 200));
      setTotalCount(data.totalCount || 0);
    } finally { setLoading(false); }
  }, [selectedCat]);

  useEffect(() => { setPage(1); }, [selectedCat, sort]);
  useEffect(() => { fetchProducts(page); window.scrollTo({ top: 0, behavior: "smooth" }); }, [page, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-black">Trending Now</h1>
          </div>
          <p className="text-orange-100">The hottest products everyone is buying right now</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-yellow-300" /> Live trending data
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Zap size={14} className="text-yellow-300" /> Updated hourly
            </span>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCat("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!selectedCat ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
          >
            All
          </button>
          {CATEGORIES.slice(0, 12).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(selectedCat === cat.id ? "" : cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1 ${selectedCat === cat.id ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{totalCount.toLocaleString()} trending products</p>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg text-sm py-2 px-3 bg-white focus:border-orange-400 focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />
        {!loading && products.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setPage(p)} showTotal={totalCount} perPage={50} />
        )}
      </div>
    </div>
  );
}
