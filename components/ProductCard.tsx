"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Zap, TrendingUp } from "lucide-react";
import { formatPrice, truncate } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  salePrice: string;
  originalPrice?: string;
  discount?: string;
  rating?: string;
  soldCount?: number;
  promotionLink?: string;
  category?: string;
  source?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProductCard({
  id,
  title,
  image,
  salePrice,
  originalPrice,
  discount,
  rating,
  soldCount,
  category = "",
  source = "card",
  size = "md",
}: ProductCardProps) {
  const discountNum = discount ? parseInt(discount) : 0;
  const ratingNum = rating ? parseFloat(rating) / 20 : 4.5;
  const isHot = (soldCount || 0) > 50000;

  // ALWAYS route through /go/[id] for affiliate tracking — never expose raw links
  const affiliateUrl = `/go/${id}?src=${encodeURIComponent(source)}&cat=${encodeURIComponent(category)}&title=${encodeURIComponent(title.slice(0, 40))}`;

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      href={`/product/${id}`}
      className="group block bg-white rounded-lg border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-200 overflow-hidden relative"
    >
      {/* Badges */}
      <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
        {discountNum >= 50 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Zap size={8} />-{discountNum}%
          </span>
        )}
        {discountNum > 0 && discountNum < 50 && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discountNum}%
          </span>
        )}
        {isHot && (
          <span className="bg-yellow-400 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <TrendingUp size={8} />HOT
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes={size === "lg" ? "280px" : size === "sm" ? "160px" : "220px"}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/seed/${id.slice(-4)}/400/400`;
          }}
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-2.5">
        <p className="text-xs text-gray-700 leading-tight line-clamp-2 min-h-[2.5rem] mb-1.5">
          {truncate(title, 90)}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-orange-600 font-black text-sm">{formatPrice(salePrice)}</span>
          {originalPrice && parseFloat(originalPrice) > parseFloat(salePrice) && (
            <span className="text-gray-400 text-[11px] line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Stars + sold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={9}
                  className={star <= Math.round(ratingNum) ? "fill-orange-400 text-orange-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            {soldCount !== undefined && soldCount > 0 && (
              <span className="text-gray-400 text-[10px]">
                {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}
              </span>
            )}
          </div>

          <button
            onClick={handleBuy}
            className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5 transition-colors shrink-0"
          >
            <ShoppingCart size={9} />
            Buy
          </button>
        </div>

        {parseFloat(salePrice) > 5 && (
          <div className="mt-1.5">
            <span className="text-[10px] text-green-600 font-medium">🚚 Free Shipping</span>
          </div>
        )}
      </div>
    </Link>
  );
}
