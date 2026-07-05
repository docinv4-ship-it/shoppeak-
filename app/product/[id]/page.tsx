"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ExternalLink, ShoppingCart, Share2, Package, Truck, Shield, Heart, BarChart2, Tag, Globe, Zap, Check, Loader2 } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { AliProduct } from "@/lib/aliexpress";
import { formatPrice } from "@/lib/utils";
import { useShopStore } from "@/store/useShopStore";
import { supabase } from "@/lib/db";

function StarRating({ rating, count }: { rating: string; count?: number }) {
  const r = parseFloat(rating) / 20;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} size={15} className={s <= Math.round(r) ? "fill-orange-400 text-orange-400" : "text-gray-200 fill-gray-200"} />
        ))}
      </div>
      <span className="text-sm font-semibold text-orange-500">{r.toFixed(1)}</span>
      {count !== undefined && <span className="text-sm text-gray-400">({count.toLocaleString()} sold)</span>}
    </div>
  );
}

function generateVariants(title: string): { label: string; options: string[] }[] {
  const lower = title.toLowerCase();
  const variants: { label: string; options: string[] }[] = [];
  if (lower.includes("phone") || lower.includes("smartphone") || lower.includes("poco") || lower.includes("redmi") || lower.includes("xiaomi")) {
    variants.push({ label: "Storage", options: ["64GB", "128GB", "256GB", "512GB"] });
    variants.push({ label: "RAM", options: ["4GB", "6GB", "8GB", "12GB"] });
    variants.push({ label: "Color", options: ["Black", "White", "Blue", "Gold"] });
  } else if (lower.includes("ring") || lower.includes("necklace") || lower.includes("bracelet") || lower.includes("jewelry")) {
    variants.push({ label: "Size", options: ["5", "6", "7", "8", "9", "10"] });
    variants.push({ label: "Material", options: ["Gold Plated", "Silver 925", "Rose Gold", "Platinum Plated"] });
  } else if (lower.includes("sofa") || lower.includes("chair") || lower.includes("furniture")) {
    variants.push({ label: "Color", options: ["Beige", "Dark Grey", "Navy Blue", "Cognac Brown", "Forest Green"] });
    variants.push({ label: "Size", options: ["1-Seater", "2-Seater", "3-Seater", "L-Shaped"] });
  } else if (lower.includes("dress") || lower.includes("jacket") || lower.includes("clothing") || lower.includes("suit")) {
    variants.push({ label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL", "3XL"] });
    variants.push({ label: "Color", options: ["Black", "White", "Red", "Navy", "Beige"] });
  } else if (lower.includes("laptop") || lower.includes("tablet")) {
    variants.push({ label: "Storage", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"] });
    variants.push({ label: "RAM", options: ["8GB", "16GB", "32GB", "64GB"] });
    variants.push({ label: "Color", options: ["Space Grey", "Silver", "Black"] });
  } else if (lower.includes("watch") || lower.includes("smartwatch")) {
    variants.push({ label: "Color", options: ["Black", "Silver", "Gold", "Rose Gold"] });
    variants.push({ label: "Strap", options: ["Silicone", "Leather", "Metal Mesh", "Nylon"] });
  } else {
    variants.push({ label: "Color", options: ["Black", "White", "Silver"] });
    variants.push({ label: "Size", options: ["Standard", "Large", "XL"] });
  }
  return variants;
}

function generateSpecs(product: AliProduct): { label: string; value: string }[] {
  const lower = product.product_title.toLowerCase();
  const base = [
    { label: "SKU / Product ID", value: product.product_id },
    { label: "Availability", value: "✅ In Stock" },
    { label: "Sold Count", value: (product.lastest_volume || 0).toLocaleString() + " units" },
    { label: "Customer Rating", value: (parseFloat(product.evaluate_rate || "95") / 20).toFixed(1) + " / 5.0" },
    { label: "Shipping", value: "Free Worldwide Shipping" },
    { label: "Delivery", value: "10–25 business days (standard)" },
    { label: "Express Option", value: "3–7 business days (ePacket / DHL)" },
    { label: "Return Policy", value: "60-day buyer protection" },
    { label: "Payment", value: "Visa, Mastercard, PayPal, Apple Pay" },
  ];
  if (lower.includes("phone") || lower.includes("smartphone")) {
    base.push(
      { label: "Network", value: "4G LTE / 5G" },
      { label: "OS", value: "Android 13 / 14" },
      { label: "Battery", value: "4500–6000 mAh" },
      { label: "Display", value: "6.5–6.9 inch AMOLED" },
      { label: "Camera", value: "48MP + 13MP + 5MP Triple" },
      { label: "Charging", value: "33W–120W Fast Charging" },
    );
  } else if (lower.includes("laptop")) {
    base.push(
      { label: "Processor", value: "Intel Core i9 / AMD Ryzen 9" },
      { label: "GPU", value: "RTX 4060 / RTX 4070" },
      { label: "Display", value: "15.6–17.3 inch QHD 165Hz" },
      { label: "Battery Life", value: "Up to 10 hours" },
      { label: "Weight", value: "1.8–2.5 kg" },
      { label: "Ports", value: "USB-C, USB-A x3, HDMI 2.1, SD" },
    );
  } else if (lower.includes("ring") || lower.includes("jewelry")) {
    base.push(
      { label: "Material", value: "18K Gold Plated / 925 Sterling Silver" },
      { label: "Stone", value: "Moissanite / CZ / Lab Diamond" },
      { label: "Stone Size", value: "0.5–2.0 Carat" },
      { label: "Dimensions", value: "Width: 6mm, Height: 8mm" },
      { label: "Weight", value: "2–5 grams" },
      { label: "Packaging", value: "Luxury gift box included" },
    );
  } else if (lower.includes("sofa") || lower.includes("couch")) {
    base.push(
      { label: "Dimensions", value: "200–280 cm × 90 cm × 80 cm" },
      { label: "Weight", value: "45–80 kg" },
      { label: "Frame", value: "Solid Hardwood" },
      { label: "Cushion Fill", value: "High-Density Foam" },
      { label: "Upholstery", value: "Premium Velvet / Linen / Leather" },
      { label: "Assembly", value: "Required (tools included)" },
    );
  } else if (lower.includes("watch")) {
    base.push(
      { label: "Case Diameter", value: "40–47 mm" },
      { label: "Case Material", value: "Stainless Steel / Titanium" },
      { label: "Crystal", value: "Sapphire / Mineral Glass" },
      { label: "Water Resistance", value: "30–100 ATM" },
      { label: "Movement", value: "Automatic / Quartz / Smart" },
      { label: "Strap Width", value: "20–24 mm" },
    );
  }
  return base;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<AliProduct | null>(null);
  const [related, setRelated] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Zustand Store Hooks
  const { addToCart, saveToBoard } = useShopStore();

  useEffect(() => {
    setLoading(true);
    setError(false);
    setSelectedImage(0);
    setSelectedVariants({});

    fetch(`/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(async (data) => {
        setProduct(data);
        const imgs: string[] = [data.product_main_image_url].filter(Boolean);
        const smalls = data.product_small_image_urls?.string;
        if (Array.isArray(smalls)) {
          imgs.push(...smalls.filter(Boolean).slice(0, 8));
        } else if (smalls && typeof smalls === "string") {
          imgs.push(smalls);
        }
        setImages([...new Set(imgs)]);

        // Explicit dynamic fallback to ignore internal strictly typed schema mismatch
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: wishItem } = await (supabase.from("wishlists") as any)
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", data.product_id)
            .single();
          if (wishItem) setWishlist(true);
        }

        const titleWords = data.product_title?.split(" ").slice(0, 3).join(" ") || "trending";
        return fetch(`/api/products/search?q=${encodeURIComponent(titleWords)}&pageSize=12`);
      })
      .then(r => r.json())
      .then(d => setRelated((d.products || []).filter((p: AliProduct) => p.product_id !== id).slice(0, 10)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Full Wishlist Handler (Supabase + Zustand Store Mapping)
  const handleWishlistToggle = async () => {
    if (!product) return;

    const previousState = wishlist;
    setWishlist(!previousState);

    // Normalize object structure for store ingestion
    const mappedProduct = {
      product_id: product.product_id,
      product_title: product.product_title,
      product_main_image_url: product.product_main_image_url,
      sale_price: product.app_sale_price || product.sale_price,
      original_price: product.original_price || "",
      promotion_link: `/go/${product.product_id}`,
      discount: product.discount || "0",
    };

    // Client Store Engine Execution
    saveToBoard("Saved Items", mappedProduct);

    // Secure Pipeline Session Acquisition
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!previousState) {
      await (supabase.from("wishlists") as any).upsert({
        user_id: user.id,
        product_id: product.product_id,
        product_title: product.product_title,
        product_main_image_url: product.product_main_image_url,
        sale_price: product.app_sale_price || product.sale_price,
        original_price: product.original_price,
        promotion_link: `/go/${product.product_id}`,
        discount: product.discount,
      });
    } else {
      await (supabase.from("wishlists") as any)
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.product_id);
    }
  };

  // Full Add to Cart Handler (Supabase + Zustand Sync Engine)
  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);

    const mappedProduct = {
      product_id: product.product_id,
      product_title: product.product_title,
      product_main_image_url: product.product_main_image_url,
      sale_price: product.app_sale_price || product.sale_price,
      original_price: product.original_price || "",
      promotion_link: `/go/${product.product_id}`,
      discount: product.discount || "0",
    };

    // Fast-track state modification
    addToCart(mappedProduct);

    // Cloud DB Persist Lifecycle
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase.from("carts") as any).upsert({
        user_id: user.id,
        product_id: product.product_id,
        product_title: product.product_title,
        product_main_image_url: product.product_main_image_url,
        sale_price: product.app_sale_price || product.sale_price,
        original_price: product.original_price,
        promotion_link: `/go/${product.product_id}`,
        discount: product.discount,
        quantity: 1,
        saved_for_later: false,
      });
    }
    setCartLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-200 rounded-xl aspect-square" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-full" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-3">😕</p>
        <h1 className="text-xl font-bold mb-2">Product not found</h1>
        <p className="text-gray-500 mb-4">This product may no longer be available on AliExpress.</p>
        <Link href="/browse" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const discountNum = product.discount ? parseInt(product.discount) : 0;
  const affiliateTrackUrl = `/go/${product.product_id}?src=product-detail&title=${encodeURIComponent(product.product_title.slice(0, 40))}`;
  const variants = generateVariants(product.product_title);
  const specs = generateSpecs(product);
  const salePrice = product.app_sale_price || product.sale_price;
  const origPrice = product.original_price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        <span>›</span>
        <Link href="/browse" className="hover:text-orange-500">Browse</Link>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-xs">{product.product_title?.slice(0, 50)}...</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image gallery */}
        <div>
          {/* Main image */}
          <div className="relative bg-white border border-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.product_title}
                fill
                className="object-contain p-4"
                unoptimized
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = `https://picsum.photos/seed/${product.product_id}/500/500`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🛍️</div>
            )}
            {discountNum > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                -{discountNum}% OFF
              </div>
            )}
            {/* Image nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                  disabled={selectedImage === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-1.5 disabled:opacity-30 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={() => setSelectedImage(i => Math.min(images.length - 1, i + 1))}
                  disabled={selectedImage === images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-1.5 disabled:opacity-30 transition-all"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    i === selectedImage ? "border-orange-500 shadow-sm" : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video player if available */}
          {product.product_video_url && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
              <video
                src={product.product_video_url}
                controls
                muted
                className="w-full rounded-xl"
                poster={images[0]}
              />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-4">
          {/* Title + wishlist */}
          <div className="flex items-start gap-2">
            <h1 className="text-xl font-bold text-gray-800 leading-snug flex-1">{product.product_title}</h1>
            <button
              onClick={handleWishlistToggle}
              className={`flex-shrink-0 p-2 rounded-full border transition-colors ${
                wishlist ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
              }`}
            >
              <Heart size={18} className={wishlist ? "fill-red-500" : ""} />
            </button>
          </div>

          {/* Rating + sold */}
          <div className="flex items-center gap-3 flex-wrap">
            <StarRating rating={product.evaluate_rate || "96"} count={product.lastest_volume} />
            <span className="text-xs text-gray-400">|</span>
            <Link href="/compare" className="text-xs text-orange-500 hover:underline flex items-center gap-1">
              <BarChart2 size={12} /> Add to Compare
            </Link>
          </div>

          {/* Price block */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-orange-600">{formatPrice(salePrice)}</span>
              {origPrice && parseFloat(origPrice) > parseFloat(salePrice) && (
                <span className="text-gray-400 line-through text-lg">{formatPrice(origPrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {discountNum > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discountNum}% OFF</span>
              )}
              {discountNum > 0 && origPrice && (
                <span className="text-green-600 text-sm font-medium">
                  You save {formatPrice(String(parseFloat(origPrice) - parseFloat(salePrice)))}
                </span>
              )}
              <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap size={10} /> AliExpress Price
              </span>
            </div>
          </div>

          {/* Variants */}
          {variants.map(variant => (
            <div key={variant.label}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {variant.label}: <span className="text-orange-500">{selectedVariants[variant.label] || "Select"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariants(sv => ({ ...sv, [variant.label]: sv[variant.label] === opt ? "" : opt }))}
                    className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-colors font-medium ${
                      selectedVariants[variant.label] === opt
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    {selectedVariants[variant.label] === opt && <Check size={11} className="inline mr-1" />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Shipping info */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Truck size={15} className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700"><strong className="text-green-600">Free Shipping</strong> — Worldwide delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package size={15} className="text-blue-500 flex-shrink-0" />
              <span className="text-gray-700"><strong>Delivery:</strong> 10–25 days standard · 3–7 days express</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield size={15} className="text-orange-500 flex-shrink-0" />
              <span className="text-gray-700"><strong>Buyer Protection:</strong> Full refund if not delivered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe size={15} className="text-purple-500 flex-shrink-0" />
              <span className="text-gray-700"><strong>Ships from:</strong> China · Multiple warehouses</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag size={15} className="text-orange-400 flex-shrink-0" />
              <span className="text-gray-700"><strong>Return:</strong> 60-day return window · Free returns on defects</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Shield, label: "Buyer Protection", color: "text-green-500" },
              { icon: Truck, label: "Free Shipping", color: "text-blue-500" },
              { icon: Package, label: "Fast Delivery", color: "text-orange-500" },
              { icon: Globe, label: "Ships Global", color: "text-purple-500" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                <Icon size={16} className={color} />
                <span className="text-[10px] font-medium text-gray-600 leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Dual Action Stack */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:from-amber-300 disabled:to-yellow-300 active:scale-[0.98] text-neutral-900 font-bold py-4 px-6 rounded-xl text-base transition-all shadow-md shadow-amber-100 border border-amber-500/20"
            >
              {cartLoading ? (
                <Loader2 size={20} className="animate-spin text-neutral-900" />
              ) : (
                <ShoppingCart size={20} />
              )}
              {cartLoading ? "Adding to Cart..." : "Add to Cart"}
            </button>

            <a
              href={affiliateTrackUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-md shadow-orange-200"
            >
              <Zap size={20} fill="currentColor" />
              Buy Now on AliExpress
              <ExternalLink size={15} />
            </a>
          </div>

          <div className="flex gap-2">
            <a
              href={affiliateTrackUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-orange-500 text-orange-600 font-semibold py-3 px-4 rounded-xl text-sm hover:bg-orange-50 transition-colors"
            >
              View on AliExpress
            </a>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: product.product_title, url: window.location.href });
                else { navigator.clipboard.writeText(window.location.href); }
              }}
              className="border border-gray-200 text-gray-500 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center leading-tight">
            Affiliate link — ShopPeak earns a small commission on purchases at no extra cost to you.{" "}
            <Link href="/affiliate-disclosure" className="text-orange-400 hover:underline">Disclosure</Link>
          </p>
        </div>
      </div>

      {/* Specs + Description */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
        <div className="border-b border-gray-100 px-5 py-3">
          <span className="text-sm font-bold text-orange-600 border-b-2 border-orange-500 pb-1">Specifications</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {specs.map((spec, i) => (
              <div key={spec.label} className={`flex items-start gap-3 py-2 px-3 rounded-lg ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="text-xs font-semibold text-gray-500 w-32 flex-shrink-0 pt-0.5">{spec.label}</span>
                <span className="text-xs text-gray-800 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-orange-500 w-1 h-5 rounded inline-block"></span>
          Product Description
        </h2>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p className="font-medium text-gray-700">{product.product_title}</p>
          <p>
            This product ships directly from verified AliExpress sellers with full buyer protection. Over{" "}
            <strong className="text-orange-600">{(product.lastest_volume || 0).toLocaleString()} customers</strong> have
            purchased this product, with an average satisfaction rating of{" "}
            <strong className="text-orange-600">{(parseFloat(product.evaluate_rate || "96") / 20).toFixed(1)}/5</strong>.
          </p>
          <p>
            All orders include AliExpress&apos;s standard buyer protection plan. Payments are processed securely through
            AliExpress with support for major credit cards, PayPal, and local payment methods.
          </p>

          <div className="bg-orange-50 rounded-xl p-4 mt-3">
            <p className="font-semibold text-orange-800 mb-2 text-sm">✨ Key Features</p>
            <ul className="space-y-1">
              {[
                "Premium quality with strict quality control",
                `Rated ${(parseFloat(product.evaluate_rate || "96") / 20).toFixed(1)}/5 by verified buyers`,
                `${(product.lastest_volume || 0).toLocaleString()} units sold worldwide`,
                "Free worldwide shipping included",
                "60-day buyer protection guarantee",
                "Fast 3–7 day express shipping available",
                "Easy returns on defective items",
              ].map(feature => (
                <li key={feature} className="flex items-center gap-2 text-xs text-orange-700">
                  <Check size={12} className="text-orange-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-2">
            <p className="font-semibold text-green-800 text-sm mb-1">🛡️ AliExpress Buyer Protection</p>
            <p className="text-xs text-green-700">Full refund if you don&apos;t receive your order. Full or partial refund if the item is not as described.</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-orange-500 w-1 h-5 rounded inline-block"></span>
            You Might Also Like
          </h2>
          <ProductGrid products={related} cols={5} />
        </div>
      )}
    </div>
  );
}
