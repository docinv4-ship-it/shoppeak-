"use client";
import { useState, useEffect, use } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";

const BRAND_MAP: Record<string, { name: string; desc: string; emoji: string }> = {
  "samsung": { name: "Samsung", desc: "Leading smartphones, TVs, and home appliances", emoji: "📱" },
  "xiaomi": { name: "Xiaomi", desc: "Innovative tech at affordable prices", emoji: "🔋" },
  "huawei": { name: "Huawei", desc: "Premium smartphones and smart devices", emoji: "📡" },
  "apple": { name: "Apple Style", desc: "Apple-compatible accessories and cases", emoji: "🍎" },
  "anker": { name: "Anker", desc: "Charging and power accessories", emoji: "⚡" },
  "baseus": { name: "Baseus", desc: "Premium phone and tech accessories", emoji: "🔌" },
};

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const brand = BRAND_MAP[slug] || { name: slug.charAt(0).toUpperCase() + slug.slice(1), desc: `Products by ${slug}`, emoji: "🏷️" };

  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(50);

  useEffect(() => {
    setLoading(true);
    const seed = parseInt(sessionStorage?.getItem?.("sp_brand_seed") || "0") || Math.floor(Math.random() * 9999) + 1;
    sessionStorage?.setItem?.("sp_brand_seed", String(seed));
    const params = new URLSearchParams({ q: brand.name + " official genuine", page: String(page), pageSize: "50", seed: String(seed) });
    fetch(`/api/products/search?${params}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Math.min(data.totalPage || 50, 100));
      })
      .finally(() => setLoading(false));
  }, [page, brand.name]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
        <ChevronLeft size={15} /> Browse Categories
      </Link>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{brand.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={14} className="text-yellow-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Official Brand</span>
            </div>
            <h1 className="text-2xl font-black">{brand.name}</h1>
            <p className="text-gray-300 text-sm">{brand.desc}</p>
          </div>
        </div>
      </div>
      <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />
      {!loading && products.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} perPage={50} />
      )}
    </div>
  );
}
