"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { CATEGORIES } from "@/data/categories";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Recommended", value: "" },
  { label: "Price: Low to High", value: "SALE_PRICE_ASC" },
  { label: "Price: High to Low", value: "SALE_PRICE_DESC" },
  { label: "Best Discount", value: "DISCOUNT_DESC" },
  { label: "Most Orders", value: "LAST_VOLUME_DESC" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under $10", min: "", max: "10" },
  { label: "$10 – $50", min: "10", max: "50" },
  { label: "$50 – $200", min: "50", max: "200" },
  { label: "$200 – $1,000", min: "200", max: "1000" },
  { label: "Over $1,000", min: "1000", max: "" },
];

const BROWSE_KEYWORDS = [
  "trending products premium", "best seller global market", "new arrival luxury trend", "top rated choice",
  "hot items high value", "viral unique gadgets", "most ordered flagship", "recommended collections",
  "flash sale exclusive", "top picks hyper demand", "must have innovations", "staff choice picks",
  "premium high quality gear", "daily deals trending", "customer favorite picks",
];

export default function BrowsePage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(200);
  const [totalCount, setTotalCount] = useState(10000);
  const [selectedCat, setSelectedCat] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const seedRef = useRef<number>(0);

  useEffect(() => {
    const key = "sp_browse_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { s = Math.floor(Math.random() * 9999) + 1; sessionStorage.setItem(key, String(s)); }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const catData = CATEGORIES.find(c => c.id === selectedCat);
      const kwIndex = ((p - 1) + seedRef.current) % BROWSE_KEYWORDS.length;
      const keyword = catData?.keywords?.[p % (catData.keywords?.length || 1)] || BROWSE_KEYWORDS[kwIndex];
      
      const params = new URLSearchParams({ 
        q: keyword, 
        page: String(p), 
        pageSize: "50", 
        seed: String(seedRef.current) 
      });
      
      if (selectedCat) params.set("cat", selectedCat);
      if (sort) params.set("sort", sort);
      if (priceRange.min) params.set("minPrice", priceRange.min);
      if (priceRange.max) params.set("maxPrice", priceRange.max);
      
      const res = await fetch(`/api/products/search?${params}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      setTotalPages(Math.min(data.totalPage || 200, 200));
      setTotalCount(data.totalCount || (data.products?.length || 0) * Math.min(data.totalPage || 200, 200));
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [selectedCat, sort, priceRange]);

  useEffect(() => { setPage(1); }, [selectedCat, sort, priceRange]);
  useEffect(() => { fetchProducts(page); window.scrollTo({ top: 0, behavior: "smooth" }); }, [page, fetchProducts]);

  // ⚡ DUAL INTERACTION ENGINE: Client side rigorous fallback arrangement sorting protection
  const optimizedProcessedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    let processingPool = [...products];

    // Client execution sort matching guarantees response visual transformation instantly
    if (sort === "SALE_PRICE_ASC") {
      processingPool.sort((a, b) => parseFloat(a.sale_price || "0") - parseFloat(b.sale_price || "0"));
    } else if (sort === "SALE_PRICE_DESC") {
      processingPool.sort((a, b) => parseFloat(b.sale_price || "0") - parseFloat(a.sale_price || "0"));
    } else if (sort === "DISCOUNT_DESC") {
      processingPool.sort((a, b) => parseFloat(b.discount || "0") - parseFloat(a.discount || "0"));
    } else if (sort === "LAST_VOLUME_DESC") {
      processingPool.sort((a, b) => (b.lastest_volume || 0) - (a.lastest_volume || 0));
    }
    return processingPool;
  }, [products, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setSelectedCat("")} className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${!selectedCat ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "border-gray-200 text-gray-700 hover:border-orange-400 bg-gray-50 hover:bg-gray-100"}`}>All Products</button>
          {CATEGORIES.slice(0, 14).map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(selectedCat === cat.id ? "" : cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 ${selectedCat === cat.id ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "border-gray-200 text-gray-700 hover:border-orange-400 bg-gray-50 hover:bg-gray-100"}`}>
              <span>{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(f => !f)} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-white text-gray-800 hover:border-orange-400 hover:text-orange-500 transition-all shadow-sm">
              <SlidersHorizontal size={14} />Filters
              {(priceRange.min || priceRange.max) && <span className="bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">1</span>}
            </button>
            <span className="text-sm text-gray-500 font-medium hidden sm:block">{totalCount.toLocaleString()} products found</span>
          </div>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="border border-gray-200 font-semibold rounded-lg text-sm py-2 px-3 bg-white text-gray-800 focus:border-orange-500 focus:outline-none shadow-sm cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* 💎 PREMIUM UI CONTROL BLOCK: Fixed contrast white layer invisibility issues completely */}
        {showFilters && (
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-4 mb-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide">Select Price Range</h3>
              <button onClick={() => { setPriceRange({ min: "", max: "" }); setShowFilters(false); }} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"><X size={17} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(range => {
                const isSelected = priceRange.min === range.min && priceRange.max === range.max;
                return (
                  <button 
                    key={range.label} 
                    onClick={() => setPriceRange({ min: range.min, max: range.max })}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                      isSelected 
                        ? "bg-orange-600 text-white border-orange-600 font-black scale-[1.02]" 
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <ProductGrid products={optimizedProcessedProducts} cols={5} loading={loading} skeletonCount={50} />
        
        {!loading && optimizedProcessedProducts.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => { setPage(p); }} showTotal={totalCount} perPage={50} />
        )}
      </div>
    </div>
  );
}
