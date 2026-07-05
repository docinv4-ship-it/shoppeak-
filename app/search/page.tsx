"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; sort?: string; minPrice?: string; maxPrice?: string }> }) {
  const params = use(searchParams);
  const router = useRouter();
  const [query, setQuery] = useState(params.q || "");
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(parseInt(params.page || "1"));
  const [totalPages, setTotalPages] = useState(10);
  const [sort, setSort] = useState(params.sort || "LAST_VOLUME_DESC");
  const [minPrice, setMinPrice] = useState(params.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(params.maxPrice || "");
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!params.q) return;
    setLoading(true);
    const qParams = new URLSearchParams({
      q: params.q,
      page: String(page),
      pageSize: "40",
      sort,
    });
    if (minPrice) qParams.set("minPrice", minPrice);
    if (maxPrice) qParams.set("maxPrice", maxPrice);

    const seed = parseInt(sessionStorage?.getItem?.("sp_search_seed") || "0") || Math.floor(Math.random() * 9999) + 1;
    qParams.set("pageSize", "50");
    qParams.set("seed", String(seed));
    fetch(`/api/products/search?${qParams}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Math.min(data.totalPage || 200, 200));
        setTotalCount(data.totalCount || (data.products?.length || 0) * Math.min(data.totalPage || 200, 200));
      })
      .finally(() => setLoading(false));
  }, [params.q, page, sort, minPrice, maxPrice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="flex-1 flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="bg-orange-500 text-white px-5 hover:bg-orange-600 transition-colors">
            <Search size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="border border-gray-200 bg-white rounded-xl px-4 flex items-center gap-2 text-sm hover:border-orange-300 transition-colors"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </form>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Sort By</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm">
                <option value="LAST_VOLUME_DESC">Most Popular</option>
                <option value="SALE_PRICE_ASC">Price: Low to High</option>
                <option value="SALE_PRICE_DESC">Price: High to Low</option>
                <option value="DISCOUNT_DESC">Biggest Discount</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Min Price ($)</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Max Price ($)</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" />
            </div>
          </div>
        </div>
      )}

      {params.q ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Results for &ldquo;<span className="text-orange-500">{params.q}</span>&rdquo;
              </h1>
              {totalCount > 0 && <p className="text-xs text-gray-500">{totalCount.toLocaleString()} products found</p>}
            </div>
          </div>
          <ProductGrid products={products} cols={5} loading={loading} />
          {!loading && products.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      ) : (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Search ShopPeak</h2>
          <p className="text-gray-400">Enter a product name, brand, or category above</p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["smartphone", "watch", "laptop", "earbuds", "ring", "dress", "sofa", "drone"].map(s => (
              <button key={s} onClick={() => router.push(`/search?q=${s}`)} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
