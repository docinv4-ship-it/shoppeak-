"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { Flame, Clock, Zap, Tag } from "lucide-react";

// Proven keywords — each returns 47-50 products from AliExpress API (verified)
const DAILY_KEYWORDS = [
  "best price",
  "flash sale",
  "clearance sale",
  "top deal",
  "popular sale",
  "special offer",
  "hot item",
  "mega sale",
  "best value",
  "great deal",
  "top seller",
  "most popular",
];

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "Electronics", value: "flash sale electronics" },
  { label: "Fashion", value: "clearance fashion clothing" },
  { label: "Home", value: "best price home furniture" },
  { label: "Phones", value: "top deal smartphone" },
  { label: "Jewelry", value: "special offer jewelry" },
  { label: "Sports", value: "popular sale sports" },
];

export default function DailyDealsPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const seedRef = useRef(0);

  useEffect(() => {
    const key = "sp_daily_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number, filterIdx: number) => {
    setLoading(true);
    try {
      const filterKw = CATEGORY_FILTERS[filterIdx].value;
      // Rotate through proven keywords; if a category filter is active, use it directly
      const kw = filterKw || DAILY_KEYWORDS[(p - 1 + Math.floor(seedRef.current / 100)) % DAILY_KEYWORDS.length];
      const params = new URLSearchParams({
        q: kw,
        page: String(p),
        pageSize: "50",
        sort: "DISCOUNT_DESC",
        seed: String(seedRef.current),
      });
      const res = await fetch(`/api/products/search?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(Math.min(Math.max(data.totalPage || 100, 50), 200));
      setTotalCount(data.totalCount || 0);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchProducts(page, activeFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, activeFilter, fetchProducts]);

  const handlePageChange = (p: number) => setPage(p);
  const handleFilter = (idx: number) => { setActiveFilter(idx); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-black">Daily Deals</h1>
          </div>
          <p className="text-red-100">Today&apos;s hottest offers — new deals added every day</p>
          <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Clock size={14} className="text-yellow-300" /> Resets at midnight
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Zap size={14} className="text-yellow-300" /> Up to 80% OFF
            </span>
            {totalCount > 0 && (
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                <Tag size={14} className="text-yellow-300" /> {totalCount.toLocaleString()} deals available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category filter strip */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORY_FILTERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => handleFilter(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilter === i ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-300"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!loading && products.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {products.length} deals · Page {page} of {totalPages}
          </p>
        )}
        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} source="daily-deals" />
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showTotal={totalCount || undefined}
            perPage={50}
          />
        )}
      </div>
    </div>
  );
}
