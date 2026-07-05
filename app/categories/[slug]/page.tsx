"use client";
import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { AliProduct } from "@/lib/aliexpress";

export default function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sub?: string }>;
}) {
  const { slug } = use(params);
  const { q: queryQ, sub } = use(searchParams);

  const category = getCategoryBySlug(slug);
  
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(200);
  const [totalCount, setTotalCount] = useState(0);
  const [activeSub, setActiveSub] = useState(sub || "");
  
  // FIX 1: Safe fallback lifecycle configuration (Bypass "trending" hardcoded breakdown string)
  const [activeKeywords, setActiveKeywords] = useState(queryQ || "");
  const [sort, setSort] = useState("LAST_VOLUME_DESC");

  // FIX 2: Sync state dynamically when category context or deep search query parameters hydrate
  useEffect(() => {
    if (category) {
      setActiveKeywords(queryQ || category.keywords || "");
    }
  }, [category?.id, queryQ]);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    
    const key = "sp_cat_seed";
    let catSeed = parseInt(sessionStorage.getItem(key) || "0");
    if (!catSeed) { 
      catSeed = Math.floor(Math.random() * 9999) + 1; 
      sessionStorage.setItem(key, String(catSeed)); 
    }
    
    // FIX 3: Dynamic parameter clean injection
    // Agar activeKeywords available na ho ya category fetch slow ho, to primary node parameters load karein
    const finalKeywords = activeKeywords || category.keywords || "";

    const paramsObj = new URLSearchParams({
      q: finalKeywords,
      page: String(page),
      pageSize: "50",
      cat: category.id,
      sort,
      seed: String(catSeed),
    });
    
    fetch(`/api/products/search?${paramsObj}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Math.min(data.totalPage || 200, 200));
        setTotalCount(data.totalCount || 0);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [page, activeKeywords, category?.id, sort]);

  if (!category) notFound();

  const handleSubcat = (keywords: string, subSlug: string) => {
    setActiveKeywords(keywords);
    setActiveSub(subSlug);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        <span>›</span>
        <Link href="/categories" className="hover:text-orange-500">Categories</Link>
        <span>›</span>
        <span className="text-gray-600">{category.name}</span>
      </div>

      {/* Hero bar */}
      <div className={`${category.color} rounded-2xl p-5 mb-6 flex items-center gap-4 text-white`}>
        <span className="text-5xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-black">{category.name}</h1>
          <p className="text-sm opacity-90 mt-0.5">{category.description}</p>
          {totalCount > 0 && (
            <p className="text-xs opacity-75 mt-1">{totalCount.toLocaleString()}+ products</p>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Subcategory pills — scrollable */}
        <div className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => { setActiveKeywords(category.keywords); setActiveSub(""); setPage(1); }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!activeSub ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 bg-white hover:border-orange-300"}`}
          >
            All
          </button>
          {category.subcategories.map(s => (
            <button
              key={s.slug}
              onClick={() => handleSubcat(s.keywords, s.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeSub === s.slug ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 bg-white hover:border-orange-300"}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:border-orange-400 focus:outline-none shrink-0"
        >
          <option value="LAST_VOLUME_DESC">Most Popular</option>
          <option value="SALE_PRICE_ASC">Price: Low → High</option>
          <option value="SALE_PRICE_DESC">Price: High → Low</option>
          <option value="DISCOUNT_DESC">Best Discount</option>
        </select>
      </div>

      <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />

      {!loading && products.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showTotal={totalCount || undefined}
          perPage={50}
        />
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-semibold text-gray-600">No products found</p>
          <p className="text-sm mt-1">Try a different subcategory or check back later</p>
        </div>
      )}

      {/* Other categories */}
      <div className="mt-10 border-t pt-6">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Explore Other Categories</h3>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.filter(c => c.slug !== slug).slice(0, 10).map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-orange-300 hover:text-orange-500 transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
