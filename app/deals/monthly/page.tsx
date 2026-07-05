"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { Calendar, Tag, Zap } from "lucide-react";

// Proven keywords — each returns 47-50 products from AliExpress API (verified)
const MONTHLY_KEYWORDS = [
  "clearance sale",
  "special offer",
  "top deal",
  "best price",
  "most popular",
  "popular sale",
  "best value",
  "hot item",
  "mega sale",
  "great deal",
  "top seller",
  "flash sale",
];

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "Electronics", value: "clearance electronics gadgets" },
  { label: "Fashion", value: "special offer fashion clothing" },
  { label: "Home", value: "best price home decor furniture" },
  { label: "Beauty", value: "popular sale beauty skincare" },
  { label: "Sports", value: "top deal sports fitness" },
];

export default function MonthlyDealsPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const seedRef = useRef(0);

  useEffect(() => {
    const key = "sp_monthly_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number, filterIdx: number) => {
    setLoading(true);
    try {
      const filterKw = CATEGORY_FILTERS[filterIdx].value;
      const kw = filterKw || MONTHLY_KEYWORDS[(p - 1 + Math.floor(seedRef.current / 100)) % MONTHLY_KEYWORDS.length];
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-black">Monthly Deals</h1>
          </div>
          <p className="text-blue-100">Best deals of the month — curated for maximum savings</p>
          <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Tag size={14} className="text-yellow-300" /> Up to 70% OFF
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Zap size={14} className="text-yellow-300" /> Updated monthly
            </span>
            {totalCount > 0 && (
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                <Tag size={14} className="text-yellow-300" /> {totalCount.toLocaleString()} products
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORY_FILTERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => { setActiveFilter(i); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilter === i ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
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
        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} source="monthly-deals" />
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={p => setPage(p)}
            showTotal={totalCount || undefined}
            perPage={50}
          />
        )}
      </div>
    </div>
  );
}
