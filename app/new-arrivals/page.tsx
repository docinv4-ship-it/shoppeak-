"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { Sparkles, Clock } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCat, setSelectedCat] = useState("");
  const seedRef = useRef(0);

  useEffect(() => {
    const key = "sp_new_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: "50", seed: String(seedRef.current) });
      if (selectedCat) params.set("cat", selectedCat);
      const res = await fetch(`/api/products/new-arrivals?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(Math.min(data.totalPage || 100, 200));
      setTotalCount(data.totalCount || 0);
    } finally { setLoading(false); }
  }, [selectedCat]);

  useEffect(() => { setPage(1); }, [selectedCat]);
  useEffect(() => { fetchProducts(page); window.scrollTo({ top: 0, behavior: "smooth" }); }, [page, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-black">New Arrivals</h1>
          </div>
          <p className="text-purple-100">The freshest products just landed — discover what&apos;s new</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Clock size={14} className="text-yellow-300" /> Updated daily
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setSelectedCat("")} className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!selectedCat ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}>All</button>
          {CATEGORIES.slice(0, 12).map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(selectedCat === cat.id ? "" : cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1 ${selectedCat === cat.id ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{totalCount.toLocaleString()} new products</p>
        </div>
        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />
        {!loading && products.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setPage(p)} showTotal={totalCount} perPage={50} />
        )}
      </div>
    </div>
  );
}
