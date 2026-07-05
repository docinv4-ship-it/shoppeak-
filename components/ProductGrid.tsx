"use client";
import ProductCard from "./ProductCard";
import { AliProduct } from "@/lib/aliexpress";

interface ProductGridProps {
  products: AliProduct[];
  cols?: 2 | 3 | 4 | 5 | 6;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  skeletonCount?: number;
  source?: string;
}

const COL_CLASSES: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-200 aspect-square" />
      <div className="p-2.5 space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-full" />
        <div className="h-2.5 bg-gray-200 rounded w-4/5" />
        <div className="h-3.5 bg-gray-200 rounded w-2/5 mt-1" />
        <div className="h-2 bg-gray-200 rounded w-3/5" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  cols = 5,
  size = "md",
  loading = false,
  skeletonCount,
  source = "grid",
}: ProductGridProps) {
  const colClass = COL_CLASSES[cols] || COL_CLASSES[5];
  const count = skeletonCount || cols * 4;

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-2.5`}>
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">🔍</p>
        <p className="font-semibold text-gray-600">No products found</p>
        <p className="text-sm mt-1">Try different keywords or browse categories</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-2.5`}>
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
          source={source}
          size={size}
        />
      ))}
    </div>
  );
}
