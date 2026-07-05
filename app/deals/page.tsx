"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { CATEGORIES } from "@/data/categories";
import { Flame, Clock, Tag } from "lucide-react";
import Link from "next/link";

// Proven keywords — verified to return 47-50 products (DISCOUNT_DESC sort)
const DEAL_TYPES = [
  { label: "All Deals", value: "best price" },
  { label: "Flash Sale", value: "flash sale" },
  { label: "Clearance", value: "clearance sale" },
  { label: "Special Offer", value: "special offer" },
  { label: "Top Deals", value: "top deal" },
  { label: "Popular Sale", value: "popular sale" },
];

export default function DealsPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTypeIdx, setSelectedTypeIdx] = useState(0);
  const [selectedCat, setSelectedCat] = useState("");
  const seedRef = useRef(0);

  useEffect(() => {
    const key = "sp_deals_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchDeals = useCallback(async (p: number, typeIdx: number, cat: string) => {
    setLoading(true);
    try {
      const keyword = DEAL_TYPES[typeIdx].value;
      const params = new URLSearchParams({
        q: keyword,
        page: String(p),
        pageSize: "50",
        sort: "DISCOUNT_DESC",
        seed: String(seedRef.current),
      });
      if (cat) params.set("cat", cat);
      const res = await fetch(`/api/products/search?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(Math.min(Math.max(data.totalPage || 100, 50), 200));
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals(page, selectedTypeIdx, selectedCat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, selectedTypeIdx, selectedCat, fetchDeals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={24} className="text-yellow-300" />
          <h1 className="text-2xl font-black">Flash Deals &amp; Hot Offers</h1>
        </div>
        <p className="text-orange-100 text-sm">Up to 80% OFF — New deals added every hour</p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-2 text-yellow-300 text-sm font-medium">
            <Clock size={16} />
            <span>Live deals — refreshed hourly</span>
          </div>
          {totalCount > 0 && (
            <span className="text-sm text-orange-200 flex items-center gap-1">
              <Tag size={14} /> {totalCount.toLocaleString()} deals found
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Link href="/deals/daily" className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
            Daily Deals →
          </Link>
          <Link href="/deals/monthly" className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
            Monthly Deals →
          </Link>
        </div>
      </div>

      {/* Deal type filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
        {DEAL_TYPES.map((type, i) => (
          <button
            key={type.value}
            onClick={() => { setSelectedTypeIdx(i); setPage(1); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors ${selectedTypeIdx === i ? "bg-red-500 text-white border-red-500" : "bg-white border-gray-200 hover:border-red-300 text-gray-700"}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => { setSelectedCat(""); setPage(1); }}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${!selectedCat ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCat(cat.id); setPage(1); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors whitespace-nowrap ${selectedCat === cat.id ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {!loading && products.length > 0 && (
        <p className="text-sm text-gray-500 mb-3">
          {products.length} deals on this page · Page {page} of {totalPages}
        </p>
      )}

      <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} source="deals" />
      {!loading && products.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setPage(p)} showTotal={totalCount || undefined} perPage={50} />
      )}
    </div>
  );
}
